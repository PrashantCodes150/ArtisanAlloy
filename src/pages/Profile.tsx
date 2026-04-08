import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut, Loader2, Shield, Key } from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

interface SecuritySettings {
  twoFactorEnabled: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({ twoFactorEnabled: false });
  const [formData, setFormData] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });

  useEffect(() => {
    fetchSecuritySettings();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) { navigate('/login-required'); return null; }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchSecuritySettings = async () => {
    try {
      const response = await axios.get('/api/v1/auth/verification-status', {
        withCredentials: true
      });
      setSecuritySettings({
        twoFactorEnabled: response.data.data.twoFactorEnabled || false
      });
    } catch (error) {
      console.error('Failed to fetch security settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try { updateUser({ ...user, ...formData }); setIsEditing(false); }
    catch (err) { console.error('Failed:', err); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const handleEnable2FA = () => {
    navigate('/two-factor-setup');
  };

  const handleDisable2FA = async () => {
    const password = prompt('Please enter your password to disable two-factor authentication:');
    if (!password) return;

    try {
      setLoading(true);
      await axios.post('/api/v1/auth/disable-2fa', { password }, {
        withCredentials: true
      });

      toast.success('Two-factor authentication disabled successfully!');
      setSecuritySettings({ twoFactorEnabled: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-6 sm:mb-8">My Profile</h1>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-jewelry-gold/20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
              <span className="font-display text-xl sm:text-3xl text-jewelry-dark font-bold">{user.firstName[0]}{user.lastName[0]}</span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-xl sm:text-2xl text-jewelry-cream break-words">{user.firstName} {user.lastName}</h2>
              <p className="font-sans text-jewelry-cream/60 break-words">{user.email}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">First Name</label>
                {isEditing ? <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold" />
                  : <div className="flex items-center gap-3 px-4 py-3 bg-jewelry-dark-light rounded-lg min-h-[50px]"><User className="w-5 h-5 text-jewelry-gold/50 flex-shrink-0" /><span className="font-sans text-jewelry-cream break-words">{user.firstName}</span></div>}
              </div>
              <div>
                <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">Last Name</label>
                {isEditing ? <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold" />
                  : <div className="flex items-center gap-3 px-4 py-3 bg-jewelry-dark-light rounded-lg min-h-[50px]"><User className="w-5 h-5 text-jewelry-gold/50 flex-shrink-0" /><span className="font-sans text-jewelry-cream break-words">{user.lastName}</span></div>}
              </div>
            </div>
            <div>
              <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-jewelry-dark-light rounded-lg min-h-[50px]"><Mail className="w-5 h-5 text-jewelry-gold/50 flex-shrink-0" /><span className="font-sans text-jewelry-cream break-words">{user.email}</span></div>
            </div>
            <div>
              <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">Phone</label>
              {isEditing ? <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Add phone" className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold" />
                : <div className="flex items-center gap-3 px-4 py-3 bg-jewelry-dark-light rounded-lg min-h-[50px]"><Phone className="w-5 h-5 text-jewelry-gold/50 flex-shrink-0" /><span className="font-sans text-jewelry-cream break-words">{user.phone || 'Not added'}</span></div>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-jewelry-gold/20">
            {isEditing ? (<>
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}</button>
            </>) : (<>
              <button onClick={() => setIsEditing(true)} className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold">Edit Profile</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-lg border border-red-500/50 text-red-400 font-sans hover:bg-red-500/10 flex items-center justify-center gap-2"><LogOut className="w-5 h-5" />Logout</button>
            </>)}
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass rounded-2xl p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-jewelry-gold" />
            <h3 className="font-display text-xl text-jewelry-cream">Security Settings</h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-jewelry-dark-light rounded-lg border border-jewelry-gold/20 gap-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-jewelry-gold flex-shrink-0" />
                <div>
                  <p className="font-sans text-jewelry-cream font-medium">Two-Factor Authentication</p>
                  <p className="font-sans text-jewelry-cream/60 text-sm">
                    {securitySettings.twoFactorEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>
              </div>
              {securitySettings.twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 font-sans text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={handleEnable2FA}
                  className="px-4 py-2 bg-jewelry-gold/20 text-jewelry-gold rounded-lg hover:bg-jewelry-gold/30 font-sans text-sm font-medium w-full sm:w-auto"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
