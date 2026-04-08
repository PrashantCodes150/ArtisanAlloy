import { useState } from 'react';
import { Store, Mail, CreditCard, Shield, Save, Loader2 } from 'lucide-react';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-jewelry-gold">Settings</h1>
        <p className="text-jewelry-cream/60 font-sans mt-1">Configure your store settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="glass rounded-xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-sans ${
                  activeTab === tab.id
                    ? 'bg-jewelry-gold/20 text-jewelry-gold'
                    : 'text-jewelry-cream/70 hover:bg-jewelry-gold/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass rounded-xl p-6">
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-jewelry-cream">Store Settings</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue="F Jewelry"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                  />
                </div>
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">Store Email</label>
                  <input
                    type="email"
                    defaultValue="contact@f-jewelry.com"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                  />
                </div>
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">Store Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                  />
                </div>
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">Currency</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">Free Shipping Threshold</label>
                  <input
                    type="number"
                    defaultValue="999"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-jewelry-cream">Email Settings</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    defaultValue="smtp.gmail.com"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-2">Email From Name</label>
                    <input
                      type="text"
                      defaultValue="F Jewelry"
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream"
                    />
                  </div>
                </div>
                <p className="text-jewelry-cream/50 text-sm">
                  Email credentials are configured via environment variables for security.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-jewelry-cream">Payment Settings</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-jewelry-gold/30 bg-jewelry-gold/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-jewelry-cream font-medium">Razorpay</span>
                    <span className="px-2 py-1 rounded bg-green-400/10 text-green-400 text-sm">Configured</span>
                  </div>
                  <p className="text-jewelry-cream/60 text-sm">
                    Razorpay credentials are configured via environment variables.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-jewelry-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-jewelry-cream font-medium">Cash on Delivery</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-jewelry-dark-light rounded-full peer peer-checked:bg-jewelry-gold"></div>
                    </label>
                  </div>
                  <p className="text-jewelry-cream/60 text-sm">Allow customers to pay on delivery</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-jewelry-cream">Security Settings</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-jewelry-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-jewelry-cream font-medium">Rate Limiting</span>
                    <span className="px-2 py-1 rounded bg-green-400/10 text-green-400 text-sm">Enabled</span>
                  </div>
                  <p className="text-jewelry-cream/60 text-sm">100 requests per 15 minutes per IP</p>
                </div>
                <div className="p-4 rounded-lg border border-jewelry-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-jewelry-cream font-medium">HTTPS/SSL</span>
                    <span className="px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 text-sm">Configure in Production</span>
                  </div>
                  <p className="text-jewelry-cream/60 text-sm">Set SSL_KEY_PATH and SSL_CERT_PATH in .env</p>
                </div>
                <div className="p-4 rounded-lg border border-jewelry-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-jewelry-cream font-medium">Email Verification</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-jewelry-dark-light rounded-full peer peer-checked:bg-jewelry-gold"></div>
                    </label>
                  </div>
                  <p className="text-jewelry-cream/60 text-sm">Require email verification for new accounts</p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-jewelry-gold/20">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
