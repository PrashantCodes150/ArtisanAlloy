import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Sparkles,
  Activity,
  Ticket,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/inventory', icon: Activity, label: 'Inventory' },
    { path: '/admin/coupons', icon: Ticket, label: 'Coupons' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Check if user is admin
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jewelry-dark px-4">
        <div className="glass rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-4">Access Denied</h1>
          <p className="text-jewelry-cream/70 font-sans mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jewelry-dark-deep flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-jewelry-dark border-r border-jewelry-gold/20 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-jewelry-gold/20">
          <Link to="/admin" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-jewelry-gold" />
            {sidebarOpen && (
              <span className="font-display text-xl text-jewelry-gold">F Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-jewelry-cream/70 hover:text-jewelry-gold"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-jewelry-gold/20 text-jewelry-gold'
                  : 'text-jewelry-cream/70 hover:bg-jewelry-gold/10 hover:text-jewelry-cream'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-sans">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-jewelry-gold/20">
          {sidebarOpen && (
            <div className="mb-4 px-4">
              <p className="text-jewelry-cream font-sans font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-jewelry-cream/50 text-sm capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-sans">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-jewelry-dark border-b border-jewelry-gold/20 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-jewelry-cream/70 hover:text-jewelry-gold"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-sans">
              <Link to="/admin" className="text-jewelry-cream/50 hover:text-jewelry-gold">
                Admin
              </Link>
              {location.pathname !== '/admin' && (
                <>
                  <ChevronRight className="w-4 h-4 text-jewelry-cream/30" />
                  <span className="text-jewelry-cream capitalize">
                    {location.pathname.split('/').pop()}
                  </span>
                </>
              )}
            </div>
          </div>

          <Link
            to="/"
            className="text-sm text-jewelry-cream/70 hover:text-jewelry-gold font-sans"
          >
            View Store →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
