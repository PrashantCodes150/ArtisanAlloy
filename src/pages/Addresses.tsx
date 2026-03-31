import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Check
} from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const Addresses = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login-required');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, user, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/users/addresses', {
        withCredentials: true
      });
      setAddresses(response.data.data?.addresses || []);
    } catch (error: any) {
      console.error('Failed to fetch addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (editingAddress) {
        await axios.patch(`/api/v1/users/addresses/${editingAddress._id}`, formData, {
          withCredentials: true
        });
        toast.success('Address updated successfully!');
      } else {
        await axios.post('/api/v1/users/addresses', formData, {
          withCredentials: true
        });
        toast.success('Address added successfully!');
      }

      setShowForm(false);
      setEditingAddress(null);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/users/addresses/${id}`, {
        withCredentials: true
      });
      toast.success('Address deleted successfully!');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await axios.patch(`/api/v1/users/addresses/${id}/default`, {}, {
        withCredentials: true
      });
      toast.success('Default address updated!');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set default address');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      fullName: user?.firstName + ' ' + user?.lastName || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  if (loading && !showForm) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jewelry-gold"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
              Delivery Addresses
            </h1>
            <p className="font-sans text-jewelry-cream/60">
              Manage your delivery addresses
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h2 className="font-display text-xl text-jewelry-cream mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    Address Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                  placeholder="Street address, P.O. box, company name, c/o"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-sans text-jewelry-cream/60 text-sm mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-jewelry-gold border-jewelry-gold/30 rounded focus:ring-jewelry-gold"
                />
                <label htmlFor="isDefault" className="font-sans text-jewelry-cream text-sm">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => {
            const Icon = getAddressIcon(address.type);

            return (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass rounded-2xl p-6 relative ${address.isDefault ? 'border-2 border-jewelry-gold' : ''
                  }`}
              >
                {address.isDefault && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-jewelry-gold text-jewelry-dark text-xs font-sans font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Default
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${address.type === 'home' ? 'bg-blue-500/20' :
                      address.type === 'work' ? 'bg-purple-500/20' :
                        'bg-gray-500/20'
                      }`}>
                      <Icon className={`w-5 h-5 ${address.type === 'home' ? 'text-blue-400' :
                        address.type === 'work' ? 'text-purple-400' :
                          'text-gray-400'
                        }`} />
                    </div>
                    <div>
                      <h3 className="font-sans text-jewelry-cream font-semibold capitalize">
                        {address.type}
                      </h3>
                      <p className="font-sans text-jewelry-cream/60 text-sm">
                        {address.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 rounded-lg text-jewelry-gold hover:bg-jewelry-gold/10"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 rounded-lg text-jewelry-rose hover:bg-jewelry-rose/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-sans text-jewelry-cream/80 text-sm">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="font-sans text-jewelry-cream/80 text-sm">
                      {address.addressLine2}
                    </p>
                  )}
                  <p className="font-sans text-jewelry-cream/80 text-sm">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="font-sans text-jewelry-cream/80 text-sm">
                    {address.country}
                  </p>
                  <p className="font-sans text-jewelry-cream/60 text-sm">
                    Phone: {address.phone}
                  </p>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="mt-4 w-full py-2 rounded-lg border border-jewelry-gold/30 text-jewelry-gold text-sm font-sans hover:bg-jewelry-gold/10"
                  >
                    Set as Default
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12">
            <MapPin className="w-24 h-24 text-jewelry-gold/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-jewelry-cream mb-4">
              No Saved Addresses
            </h2>
            <p className="font-sans text-jewelry-cream/60 mb-8">
              Add a delivery address to make checkout faster
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-8 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;