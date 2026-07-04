import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import TrustBadges from './TrustBadges';
import BrandLogo from './BrandLogo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="glass border-t border-jewelry-gold/20 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <BrandLogo size={42} className="drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                            <div className="flex flex-col">
                                <span className="font-display text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent leading-none">
                                    ArtisanAlloy
                                </span>
                                <span className="font-sans text-[10px] tracking-[0.35em] text-jewelry-gold uppercase font-semibold mt-1">JEWELRY</span>
                            </div>
                        </Link>
                        <p className="text-jewelry-cream/70 text-sm font-sans leading-relaxed">
                            Crafting timeless elegance through exquisite jewelry that tells your unique story.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="p-2 rounded-full glass-light hover:bg-jewelry-gold/20 text-jewelry-cream/80 hover:text-jewelry-gold transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full glass-light hover:bg-jewelry-gold/20 text-jewelry-cream/80 hover:text-jewelry-gold transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full glass-light hover:bg-jewelry-gold/20 text-jewelry-cream/80 hover:text-jewelry-gold transition-all duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display text-lg text-jewelry-gold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'About Us', 'Our Collection', 'History of Jewellery', 'Contact Us'].map((linkText) => {
                                const href = linkText === 'Home' ? '/' :
                                    linkText === 'About Us' ? '/about' :
                                        linkText === 'Our Collection' ? '/collection' :
                                            linkText === 'History of Jewellery' ? '/history' :
                                                '/contact';
                                return (
                                    <li key={linkText}>
                                        <Link
                                            to={href}
                                            className="text-jewelry-cream/70 hover:text-jewelry-gold transition-colors duration-300 text-sm font-sans inline-block hover:translate-x-1 transition-transform"
                                        >
                                            {linkText}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-display text-lg text-jewelry-gold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-jewelry-rose mt-0.5" />
                                <span className="text-jewelry-cream/70 text-sm font-sans">
                                    contact@Artisan-Alloy.com
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-jewelry-rose mt-0.5" />
                                <span className="text-jewelry-cream/70 text-sm font-sans">
                                    +91 1234567890
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-jewelry-rose mt-0.5" />
                                <span className="text-jewelry-cream/70 text-sm font-sans">
                                    Mumbai, India
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-display text-lg text-jewelry-gold mb-4">Newsletter</h3>
                        <p className="text-jewelry-cream/70 text-sm font-sans mb-4">
                            Subscribe to receive exclusive offers and updates.
                        </p>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-2 rounded-lg bg-jewelry-dark/50 border border-jewelry-gold/30 text-jewelry-cream placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold transition-colors font-sans text-sm"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300 text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Trust Badges Row */}
                <div className="mt-10 pt-8 border-t border-jewelry-gold/20">
                    <TrustBadges variant="footer" showLabels={true} />
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-jewelry-gold/20">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-jewelry-cream/60 text-sm font-sans">
                            © {currentYear} ArtisanAlloy. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <span className="text-jewelry-cream/60 text-sm font-sans">We Accept:</span>
                            <div className="flex space-x-2">
                                {['Visa', 'Mastercard', 'UPI', 'GPay', 'PhonePe', 'Razorpay'].map((method) => (
                                    <span key={method} className="px-2 py-1 rounded glass-light text-xs font-sans text-jewelry-cream/80">
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Additional Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-jewelry-cream/50">
                        <Link to="/privacy-policy" className="hover:text-jewelry-gold transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-jewelry-gold transition-colors">Terms & Conditions</Link>
                        <Link to="/shipping" className="hover:text-jewelry-gold transition-colors">Shipping Policy</Link>
                        <Link to="/returns" className="hover:text-jewelry-gold transition-colors">Return Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
