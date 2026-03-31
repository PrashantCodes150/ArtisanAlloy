import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface InventoryOverview {
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
  stockStatus: {
    inStockPercentage: number;
    lowStockPercentage: number;
    outOfStockPercentage: number;
  };
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: { name: string };
}

export default function InventoryManagement() {
  const [overview, setOverview] = useState<InventoryOverview | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'low-stock' | 'out-of-stock'>('overview');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [overviewRes, lowStockRes, outOfStockRes] = await Promise.all([
        axios.get('/api/v1/inventory/overview'),
        axios.get('/api/v1/inventory/low-stock?limit=10'),
        axios.get('/api/v1/inventory/out-of-stock?limit=10')
      ]);

      setOverview(overviewRes.data.data);
      setLowStockProducts(lowStockRes.data.data.products);
      setOutOfStockProducts(outOfStockRes.data.data.products);
    } catch (error: any) {
      toast.error('Failed to fetch inventory data');
      console.error('Inventory fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    const reason = prompt('Reason for stock update:');
    if (!reason) return;

    try {
      await axios.patch(`/api/v1/inventory/update-stock/${productId}`, {
        newStock,
        reason
      });
      toast.success('Stock updated successfully!');
      fetchInventoryData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    }
  };

  const StockStatusCard = ({ 
    title, 
    value, 
    percentage, 
    icon: Icon, 
    color, 
    bgColor 
  }: {
    title: string;
    value: number;
    percentage?: number;
    icon: any;
    color: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {percentage && (
          <span className={`text-sm font-medium ${
            percentage > 70 ? 'text-green-600' : percentage > 30 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {percentage}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load inventory data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage your product inventory in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StockStatusCard
            title="Total Products"
            value={overview.totalProducts}
            icon={Package}
            color="bg-blue-600"
            bgColor="bg-blue-50"
          />
          <StockStatusCard
            title="In Stock"
            value={overview.inStockProducts}
            percentage={overview.stockStatus.inStockPercentage}
            icon={TrendingUp}
            color="bg-green-600"
            bgColor="bg-green-50"
          />
          <StockStatusCard
            title="Low Stock"
            value={overview.lowStockProducts}
            percentage={overview.stockStatus.lowStockPercentage}
            icon={AlertTriangle}
            color="bg-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StockStatusCard
            title="Out of Stock"
            value={overview.outOfStockProducts}
            percentage={overview.stockStatus.outOfStockPercentage}
            icon={TrendingDown}
            color="bg-red-600"
            bgColor="bg-red-50"
          />
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Total Inventory Value</h3>
              <p className="text-sm text-gray-600">Value of all stocked items</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">₹{overview.totalStockValue.toLocaleString()}</p>
              <Activity className="w-5 h-5 text-green-600 inline ml-2" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'low-stock', label: `Low Stock (${lowStockProducts.length})` },
                { id: 'out-of-stock', label: `Out of Stock (${outOfStockProducts.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Stock Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Stock history will appear here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'low-stock' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Products Requiring Restock
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lowStockProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category?.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{product.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => updateProductStock(product._id, product.stock + 50)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Restock
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {lowStockProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No low stock products</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'out-of-stock' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Out of Stock Products
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {outOfStockProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category?.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{product.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => updateProductStock(product._id, 50)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Restock
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {outOfStockProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No out of stock products</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}