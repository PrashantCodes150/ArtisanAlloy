import { Routes, Route } from 'react-router-dom';
import { AuthProvider, CartProvider, WishlistProvider } from './context';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import CustomScrollbar from './components/CustomScrollbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Clear all guest data on app load for strict auth requirements
const clearGuestData = () => {
  localStorage.removeItem('guestCart');
  localStorage.removeItem('guestWishlist');
};

clearGuestData();

// Page imports
import Home from './pages/Home';
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


// Auth pages
import LoginRequired from './pages/LoginRequired';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorSetup from './pages/TwoFactorSetup';
import TwoFactorVerify from './pages/TwoFactorVerify';
import CustomerSupport from './pages/CustomerSupport';
import OnboardingGuard from './components/OnboardingGuard';
import EditPreferencesPage from './pages/EditPreferences';
import AuthSuccess from './pages/AuthSuccess';



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

// Layout wrapper for public pages (with Navbar and Footer)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 relative">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CustomScrollbar>
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <ScrollToTop />
              <Routes>
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
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/collection" element={<PublicLayout><Collection /></PublicLayout>} />
                <Route path="/history" element={<PublicLayout><History /></PublicLayout>} />
                <Route path="/jewellery-types" element={<PublicLayout><JewelleryTypes /></PublicLayout>} />
                <Route path="/metal-types" element={<PublicLayout><MetalTypes /></PublicLayout>} />
                <Route path="/rashi-jewellery" element={<PublicLayout><RashiJewellery /></PublicLayout>} />
                <Route path="/birthstone-jewellery" element={<PublicLayout><BirthstoneJewellery /></PublicLayout>} />
                <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />

                {/* Auth pages */}
                <Route path="/login-required" element={<PublicLayout><LoginRequired /></PublicLayout>} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
                <Route path="/two-factor-verify" element={<TwoFactorVerify />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="/onboarding" element={<OnboardingGuard />} />
                <Route path="/support" element={<PublicLayout><CustomerSupport /></PublicLayout>} />

                {/* Protected pages */}
                <Route path="/cart" element={<ProtectedRoute><PublicLayout><Cart /></PublicLayout></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><PublicLayout><Wishlist /></PublicLayout></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><PublicLayout><Checkout /></PublicLayout></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><PublicLayout><Orders /></PublicLayout></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><PublicLayout><OrderDetail /></PublicLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><PublicLayout><Profile /></PublicLayout></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><PublicLayout><Dashboard /></PublicLayout></ProtectedRoute>} />
                <Route path="/addresses" element={<ProtectedRoute><PublicLayout><Addresses /></PublicLayout></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><PublicLayout><Feedback /></PublicLayout></ProtectedRoute>} />
                <Route path="/edit-preferences" element={<ProtectedRoute><PublicLayout><EditPreferencesPage /></PublicLayout></ProtectedRoute>} />

                {/* Onboarding flow */}

              </Routes>
            </CustomScrollbar>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;