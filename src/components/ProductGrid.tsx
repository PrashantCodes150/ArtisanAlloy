import React from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[]; // Using any for now, but in a real app you'd have a Product type
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-sans text-jewelry-cream/60 text-lg mb-4">No products found</p>
        <p className="font-sans text-jewelry-cream/50">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;