import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EnhancedAuthProvider } from './context/EnhancedAuthContext';
import { CartProvider, WishlistProvider } from './context';

// Components
import EnhancedNavbar from './components/EnhancedNavbar';
import OnboardingFlow from './components/OnboardingFlow';
import AdaptiveHomepage from './components/AdaptiveHomepage';
import About from './pages/About';
import Contact from './pages/Contact';
import History from './pages/History';
import JewelleryTypes from './pages/JewelleryTypes';
import MetalTypes from './pages/MetalTypes';
import RashiJewellery from './pages/RashiJewellery';
import BirthstoneJewellery from './pages/BirthstoneJewellery';
import Collection from './pages/Collection';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import OrderDetail from './pages/OrderDetail';
import Addresses from './pages/Addresses';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorSetup from './pages/TwoFactorSetup';
import TwoFactorVerify from './pages/TwoFactorVerify';
import CustomerSupport from './pages/CustomerSupport';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import OrdersManagement from './pages/admin/OrdersManagement';
import OrderDetails from './pages/admin/OrderDetails';
import ProductsManagement from './pages/admin/ProductsManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import CouponManagement from './pages/admin/CouponManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import Settings from './pages/admin/Settings';

import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Layout wrapper for public pages (with Enhanced Navbar and Footer)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <EnhancedNavbar />
    <main className="flex-1">
      {children}
    </main>
  </div>
);

// Layout wrapper for onboarding (no navbar/footer)
const OnboardingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

function EnhancedApp() {
  return (
    <ErrorBoundary>
      <Router>
        <EnhancedAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="relative">
                <Routes>
                  {/* Onboarding Route - No Navbar/Footer */}
                  <Route path="/onboarding" element={<OnboardingLayout><OnboardingFlow /></OnboardingLayout>} />

                  {/* Enhanced Homepage with Personalization */}
                  <Route path="/" element={<PublicLayout><AdaptiveHomepage /></PublicLayout>} />

                  {/* Admin Routes - No Navbar/Footer */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="orders/:id" element={<OrderDetails />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="inventory" element={<InventoryManagement />} />
                    <Route path="coupons" element={<CouponManagement />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Public Routes - With Navbar/Footer */}
                  <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                  <Route path="/collection" element={<PublicLayout><Collection /></PublicLayout>} />
                  <Route path="/history" element={<PublicLayout><History /></PublicLayout>} />
                  <Route path="/jewellery-types" element={<PublicLayout><JewelleryTypes /></PublicLayout>} />
                  <Route path="/metal-types" element={<PublicLayout><MetalTypes /></PublicLayout>} />
                  <Route path="/rashi-jewellery" element={<PublicLayout><RashiJewellery /></PublicLayout>} />
                  <Route path="/birthstone-jewellery" element={<PublicLayout><BirthstoneJewellery /></PublicLayout>} />
                  <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
                  <Route path="/support" element={<PublicLayout><CustomerSupport /></PublicLayout>} />

                  {/* Auth pages - Standalone */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/resend-verification" element={<ResendVerification />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
                  <Route path="/two-factor-verify" element={<TwoFactorVerify />} />

                  {/* Protected pages */}
                  <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
                  <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
                  <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
                  <Route path="/orders" element={<PublicLayout><Orders /></PublicLayout>} />
                  <Route path="/orders/:id" element={<PublicLayout><OrderDetail /></PublicLayout>} />
                  <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
                  <Route path="/dashboard" element={<PublicLayout><Dashboard /></PublicLayout>} />
                  <Route path="/addresses" element={<PublicLayout><Addresses /></PublicLayout>} />
                  <Route path="/feedback" element={<PublicLayout><Feedback /></PublicLayout>} />
                  <Route path="/edit-preferences" element={<OnboardingLayout><OnboardingFlow isEditMode={true} /></OnboardingLayout>} />
                </Routes>
              </div>
            </WishlistProvider>
          </CartProvider>
        </EnhancedAuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default EnhancedApp;