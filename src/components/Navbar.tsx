import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, ChevronDown, Heart, Menu, X } from 'lucide-react';
import { useAuth, useCart, useWishlist } from '../context';
import { useAuthToast } from '../utils/authToast';
import ProfileMenu from './ProfileMenu';
import AuthModal from './AuthModal';
import BrandLogo from './BrandLogo';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { user, isAuthenticated, openAuthModal } = useAuth();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();
    const { showLoginRequired } = useAuthToast();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Our Collection', href: '/collection' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    const aboutJewelleryLinks = [
        { name: 'Jewellery Types', href: '/jewellery-types' },
        { name: 'Metal Types & Rates', href: '/metal-types' },
        { name: 'Rashi Jewellery', href: '/rashi-jewellery' },
        { name: 'Birthstone Jewellery', href: '/birthstone-jewellery' },
        { name: 'History of Jewellery', href: '/history' },
    ];

    const handleCartClick = () => {
        if (!isAuthenticated) {
            showLoginRequired();
            navigate('/login-required');
            return;
        }
        navigate('/cart');
    };

    const handleWishlistClick = () => {
        if (!isAuthenticated) {
            showLoginRequired();
            navigate('/login-required');
            return;
        }
        navigate('/wishlist');
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass ${isScrolled ? 'shadow-lg shadow-jewelry-gold/10' : ''}`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group ml-4 sm:ml-8">
                            <BrandLogo size={48} className="drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300" />
                            <div className="flex flex-col justify-center">
                                <span className="font-display text-2xl sm:text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 leading-none">ArtisanAlloy</span>
                                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] text-jewelry-gold uppercase font-semibold mt-1">JEWELRY</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-5 lg:space-x-8 flex-1 justify-center ml-10 lg:ml-16">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`relative px-3 lg:px-4 py-2 font-sans text-sm lg:text-base transition-colors duration-300 group ${location.pathname === link.href ? 'text-jewelry-gold' : 'text-jewelry-cream/90 hover:text-jewelry-gold'}`}
                                >
                                    {link.name}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-gold transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            ))}

                            {/* About Jewellery Dropdown */}
                            <div className="relative" onMouseEnter={() => setIsAboutDropdownOpen(true)} onMouseLeave={() => setIsAboutDropdownOpen(false)}>
                                <button className="relative px-3 lg:px-4 py-2 font-sans text-sm lg:text-base transition-colors duration-300 group text-jewelry-cream/90 hover:text-jewelry-gold flex items-center gap-1">
                                    Learn
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isAboutDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl shadow-2xl shadow-jewelry-gold/20 overflow-hidden">
                                        {aboutJewelleryLinks.map((link) => (
                                            <Link key={link.name} to={link.href} className="block px-5 py-3 font-sans text-sm text-jewelry-cream/90 hover:text-jewelry-gold hover:bg-jewelry-gold/10 transition-all border-b border-jewelry-gold/10 last:border-0">
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Icons & Auth */}
                            <div className="flex items-center space-x-4 mr-8">
                                <div className="relative">
                                    <button
                                        onClick={() => document.getElementById('navbar-search')?.focus()}
                                        className="p-3 text-jewelry-cream/80 hover:text-jewelry-gold transition-colors"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleWishlistClick}
                                    className="p-3 text-jewelry-cream/80 hover:text-jewelry-gold transition-colors relative"
                                >
                                    <Heart className="w-5 h-5" />
                                    {isAuthenticated && wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-jewelry-rose rounded-full text-xs flex items-center justify-center text-white">{wishlistCount}</span>
                                    )}
                                </button>

                                <button
                                    onClick={handleCartClick}
                                    className="p-3 text-jewelry-cream/80 hover:text-jewelry-gold transition-colors relative"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isAuthenticated && cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-jewelry-rose rounded-full text-xs flex items-center justify-center text-white">{cartCount}</span>
                                    )}
                                </button>

                                {/* User Menu */}
                                {isAuthenticated ? (
                                    <ProfileMenu user={user} />
                                ) : (
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="px-6 py-2.5 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold text-sm hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-jewelry-cream hover:text-jewelry-gold" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden glass border-t border-jewelry-gold/20">
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.href} className={`block font-sans py-2 ${location.pathname === link.href ? 'text-jewelry-gold' : 'text-jewelry-cream/90 hover:text-jewelry-gold'}`}>
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-2">
                                <div className="text-jewelry-gold font-sans font-semibold mb-2">Learn About Jewellery</div>
                                {aboutJewelleryLinks.map((link) => (
                                    <Link key={link.name} to={link.href} className="block font-sans text-sm text-jewelry-cream/80 hover:text-jewelry-gold py-2 pl-4">
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-jewelry-gold/20">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleWishlistClick}
                                        className="p-2 text-jewelry-cream/80 hover:text-jewelry-gold relative"
                                    >
                                        <Heart className="w-5 h-5" />
                                        {isAuthenticated && wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-jewelry-rose rounded-full text-xs flex items-center justify-center text-white">{wishlistCount}</span>}
                                    </button>
                                    <button
                                        onClick={handleCartClick}
                                        className="p-2 text-jewelry-cream/80 hover:text-jewelry-gold relative"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {isAuthenticated && cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-jewelry-rose rounded-full text-xs flex items-center justify-center text-white">{cartCount}</span>}
                                    </button>
                                </div>
                                {isAuthenticated ? (
                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-jewelry-gold/10">
                                        <span className="font-sans text-sm text-jewelry-cream">{user?.firstName}</span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="px-5 py-2 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold text-sm"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Auth Modal */}
            <AuthModal />
        </>
    );
};

export default Navbar;