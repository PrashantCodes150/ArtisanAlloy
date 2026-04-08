import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

interface FeedbackData {
  rating: number;
  category: string;
  subject: string;
  message: string;
}

const Feedback = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState<FeedbackData>({
    rating: 0,
    category: 'general',
    subject: '',
    message: ''
  });

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'product', label: 'Product Quality' },
    { value: 'service', label: 'Customer Service' },
    { value: 'website', label: 'Website Experience' },
    { value: 'delivery', label: 'Delivery & Shipping' },
    { value: 'suggestion', label: 'Suggestions' }
  ];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login-required');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/v1/feedback', {
        ...formData,
        user: user?._id,
        userEmail: user?.email
      }, {
        withCredentials: true
      });

      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rating: 0,
      category: 'general',
      subject: '',
      message: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4"> {/* Increased from pt-20 to pt-24 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-jewelry-cream mb-4">
            Feedback Submitted!
          </h2>
          <p className="font-sans text-jewelry-cream/60 mb-8">
            Thank you for taking the time to share your thoughts with us. Your feedback helps us improve our service.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10"
            >
              Submit Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen px-4 py-12"> {/* Increased from pt-20 to pt-24 */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Share Your Feedback
          </h1>
          <p className="font-sans text-jewelry-cream/60">
            We value your opinion and would love to hear from you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block font-sans text-jewelry-cream font-medium mb-4">
                How would you rate your experience? *
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-all duration-200"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${star <= (hoveredRating || formData.rating)
                        ? 'fill-jewelry-gold text-jewelry-gold'
                        : 'text-jewelry-cream/30'
                        }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-center mt-2 font-sans text-jewelry-cream/60">
                  {formData.rating === 5 && 'Excellent!'}
                  {formData.rating === 4 && 'Great!'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Needs Improvement'}
                  {formData.rating === 1 && 'Poor'}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-sans text-jewelry-cream font-medium mb-2">
                Feedback Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-sans text-jewelry-cream font-medium mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your feedback"
                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
                maxLength={100}
              />
              <p className="text-xs font-sans text-jewelry-cream/50 mt-1">
                {formData.subject.length}/100 characters
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block font-sans text-jewelry-cream font-medium mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please share your detailed feedback here..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold resize-none"
                maxLength={1000}
              />
              <p className="text-xs font-sans text-jewelry-cream/50 mt-1">
                {formData.message.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-jewelry-dark border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-jewelry-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-jewelry-gold" />
              <p className="font-sans text-jewelry-cream font-medium">Need immediate assistance?</p>
            </div>
            <p className="font-sans text-jewelry-cream/60 text-sm mb-4">
              For urgent matters, please contact our customer support team directly at
              <a href="mailto:support@fjewelry.com" className="text-jewelry-gold hover:underline ml-1">
                support@fjewelry.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;