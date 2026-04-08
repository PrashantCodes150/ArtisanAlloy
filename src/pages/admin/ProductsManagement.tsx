import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../services/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  category: { name: string };
  images: Array<{ url: string }>;
  isActive: boolean;
  createdAt: string;
}

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products?page=${page}&limit=${limit}&sort=-createdAt`);
      setProducts(response.data.data.products);
      setTotal(response.data.total || response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/products/${productId}`, { isActive: !currentStatus });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-jewelry-gold">Products</h1>
          <p className="text-jewelry-cream/60 font-sans mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jewelry-cream/50" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-jewelry-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchProducts} className="mt-4 text-jewelry-gold hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-jewelry-cream/60 text-sm font-sans bg-jewelry-dark-light/50">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-sans">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-t border-jewelry-gold/10 hover:bg-jewelry-gold/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-jewelry-dark-light overflow-hidden flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-jewelry-gold/50" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-jewelry-cream font-medium">{product.name}</p>
                            <p className="text-jewelry-cream/50 text-sm">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-jewelry-cream">
                        {product.category?.name || '-'}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-jewelry-cream font-medium">₹{product.price.toLocaleString()}</p>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <p className="text-jewelry-cream/50 text-sm line-through">
                              ₹{product.comparePrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          product.stock === 0 
                            ? 'bg-red-400/10 text-red-400'
                            : product.stock < 10
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-green-400/10 text-green-400'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleProductStatus(product._id, product.isActive)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${
                            product.isActive
                              ? 'border-green-400/30 text-green-400 bg-green-400/10'
                              : 'border-red-400/30 text-red-400 bg-red-400/10'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert('Edit modal coming soon!')}
                            className="p-2 rounded-lg hover:bg-jewelry-gold/10 text-jewelry-gold"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id, product.name)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-jewelry-cream/50">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-jewelry-gold/10">
                <p className="text-jewelry-cream/60 text-sm font-sans">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 disabled:cursor-not-allowed hover:bg-jewelry-gold/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-jewelry-cream font-sans px-4">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 disabled:cursor-not-allowed hover:bg-jewelry-gold/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Product Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <h2 className="font-display text-2xl text-jewelry-gold mb-4">Add New Product</h2>
            <p className="text-jewelry-cream/70 font-sans mb-6">
              Product creation form will be implemented here. For now, you can add products via the database or API.
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
