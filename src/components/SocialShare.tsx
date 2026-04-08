import React from 'react';
import { Share2, Facebook, Twitter, Mail, Copy, Check, Instagram } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  imageUrl = ''
}) => {
  const [copied, setCopied] = React.useState(false);

  const shareData = {
    title,
    text: description,
    url
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy the link and suggest sharing
    navigator.clipboard.writeText(url);
    // In a real app, you could open a modal with instructions
    alert('Link copied to clipboard! Open Instagram and share this link in your story or post.');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`Hi,\n\nI thought you might like this: ${url}\n\n${description}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-jewelry-cream/70 font-sans">Share:</span>
      <div className="flex gap-2">
        <button
          onClick={shareOnFacebook}
          className="p-2 rounded-full glass-light hover:bg-blue-600/20 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4 text-jewelry-cream" />
        </button>

        <button
          onClick={shareOnTwitter}
          className="p-2 rounded-full glass-light hover:bg-sky-500/20 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4 text-jewelry-cream" />
        </button>

        <button
          onClick={shareOnInstagram}
          className="p-2 rounded-full glass-light hover:bg-pink-600/20 transition-colors"
          aria-label="Share on Instagram"
        >
          <Instagram className="w-4 h-4 text-jewelry-cream" />
        </button>

        <button
          onClick={shareViaEmail}
          className="p-2 rounded-full glass-light hover:bg-green-600/20 transition-colors"
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4 text-jewelry-cream" />
        </button>

        <button
          onClick={copyToClipboard}
          className="p-2 rounded-full glass-light hover:bg-jewelry-gold/20 transition-colors relative"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-jewelry-cream" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;