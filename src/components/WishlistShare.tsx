import React, { useState } from 'react';
import { Share2, Mail, Copy, Check, X } from 'lucide-react';
import { useWishlist } from '../context';

interface WishlistShareProps {
  wishlistId: string;
  onClose: () => void;
}

const WishlistShare: React.FC<WishlistShareProps> = ({ wishlistId, onClose }) => {
  const { wishlistItems } = useWishlist();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const wishlistUrl = `${window.location.origin}/wishlist/share/${wishlistId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wishlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // In a real app, this would make an API call to send the wishlist
    // For now, we'll simulate the API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSendSuccess(true);
      setMessage('');
      setRecipientEmail('');
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending wishlist:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative glass rounded-2xl p-6 w-full max-w-md z-10 border border-jewelry-gold/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-jewelry-gold/10 transition-colors"
        >
          <X className="w-5 h-5 text-jewelry-cream" />
        </button>

        <h3 className="font-display text-xl font-bold text-jewelry-cream mb-6 text-center">
          Share Your Wishlist
        </h3>

        <div className="mb-6 p-4 glass-light rounded-xl">
          <p className="font-sans text-jewelry-cream/80 text-sm mb-2">
            {wishlistItems.length} items in your wishlist
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={wishlistUrl}
              className="flex-1 bg-jewelry-dark-light border border-jewelry-gold/20 rounded-lg px-3 py-2 text-jewelry-cream text-sm truncate"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg hover:bg-jewelry-gold/10 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-jewelry-cream" />
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSendEmail}>
          <div className="mb-4">
            <label className="block font-sans text-jewelry-cream/70 text-sm mb-2">
              Send to email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full bg-jewelry-dark-light border border-jewelry-gold/20 rounded-lg px-4 py-3 text-jewelry-cream focus:outline-none focus:ring-2 focus:ring-jewelry-gold/50 focus:border-jewelry-gold/50"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-sans text-jewelry-cream/70 text-sm mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I wanted to share my wishlist with you..."
              rows={3}
              className="w-full bg-jewelry-dark-light border border-jewelry-gold/20 rounded-lg px-4 py-3 text-jewelry-cream focus:outline-none focus:ring-2 focus:ring-jewelry-gold/50 focus:border-jewelry-gold/50 resize-none"
            />
          </div>

          {sendSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
              Wishlist sent successfully!
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send via Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WishlistShare;