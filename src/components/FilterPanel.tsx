import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Star, Heart } from 'lucide-react';
import { jewelryCategoryTree, materialTypes, stoneTypes, colorOptions } from '../data/jewelryCategories';


interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  initialFilters?: any;
}

interface Filters {
  categories: string[];
  priceRange: [number, number];
  materials: string[];
  stones: string[];
  colors: string[];
  bestsellers: boolean;
  newArrivals: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState<Filters>({
    categories: initialFilters.categories || [],
    priceRange: initialFilters.priceRange || [0, 10000],
    materials: initialFilters.materials || [],
    stones: initialFilters.stones || [],
    colors: initialFilters.colors || [],
    bestsellers: initialFilters.bestsellers || false,
    newArrivals: initialFilters.newArrivals || false,
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);
  const [priceRangeInput, setPriceRangeInput] = useState<[number, number]>(filters.priceRange);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      
      return { ...prev, categories: newCategories };
    });
  };

  const toggleMaterial = (materialId: string) => {
    setFilters(prev => {
      const newMaterials = prev.materials.includes(materialId)
        ? prev.materials.filter(id => id !== materialId)
        : [...prev.materials, materialId];
      
      return { ...prev, materials: newMaterials };
    });
  };

  const toggleStone = (stoneId: string) => {
    setFilters(prev => {
      const newStones = prev.stones.includes(stoneId)
        ? prev.stones.filter(id => id !== stoneId)
        : [...prev.stones, stoneId];
      
      return { ...prev, stones: newStones };
    });
  };

  const toggleColor = (colorId: string) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter(id => id !== colorId)
        : [...prev.colors, colorId];
      
      return { ...prev, colors: newColors };
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRangeInput([min, max]);
  };

  const applyFilters = () => {
    const updatedFilters = {
      ...filters,
      priceRange: priceRangeInput
    };
    onApplyFilters(updatedFilters);
    onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 10000],
      materials: [],
      stones: [],
      colors: [],
      bestsellers: false,
      newArrivals: false,
    });
    setPriceRangeInput([0, 10000]);
    onApplyFilters({
      categories: [],
      priceRange: [0, 10000],
      materials: [],
      stones: [],
      colors: [],
      bestsellers: false,
      newArrivals: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-jewelry-dark border-l border-jewelry-gold/20 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-jewelry-gold">Filters</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-jewelry-dark-light transition-colors"
            >
              <X className="w-5 h-5 text-jewelry-cream" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Categories Filter */}
            <div className="border-b border-jewelry-gold/10 pb-6">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="font-sans text-lg text-jewelry-cream font-medium">Categories</span>
                {expandedSections.includes('categories') ? (
                  <ChevronUp className="w-5 h-5 text-jewelry-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-jewelry-gold" />
                )}
              </button>

              {expandedSections.includes('categories') && (
                <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                  {Object.entries(jewelryCategoryTree).map(([, mainCat]) => (
                    <div key={mainCat.id} className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`cat-${mainCat.id}`}
                          checked={filters.categories.includes(mainCat.id)}
                          onChange={() => toggleCategory(mainCat.id)}
                          className="w-4 h-4 text-jewelry-gold bg-jewelry-dark border-jewelry-gold/30 rounded focus:ring-jewelry-gold focus:ring-2"
                        />
                        <label
                          htmlFor={`cat-${mainCat.id}`}
                          className="ml-2 font-sans text-jewelry-cream"
                        >
                          {mainCat.name}
                        </label>
                      </div>

                      {filters.categories.includes(mainCat.id) && (
                        <div className="ml-6 space-y-2 pl-4 border-l border-jewelry-gold/20">
                          {mainCat.subcategories.map(sub => (
                            <div key={sub.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`sub-${mainCat.id}-${sub.id}`}
                                checked={filters.categories.includes(`${mainCat.id}-${sub.id}`)}
                                onChange={() => toggleCategory(`${mainCat.id}-${sub.id}`)}
                                className="w-4 h-4 text-jewelry-gold bg-jewelry-dark border-jewelry-gold/30 rounded focus:ring-jewelry-gold focus:ring-2"
                              />
                              <label
                                htmlFor={`sub-${mainCat.id}-${sub.id}`}
                                className="ml-2 font-sans text-jewelry-cream/80 text-sm"
                              >
                                {sub.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-jewelry-gold/10 pb-6">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="font-sans text-lg text-jewelry-cream font-medium">Price Range</span>
                {expandedSections.includes('price') ? (
                  <ChevronUp className="w-5 h-5 text-jewelry-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-jewelry-gold" />
                )}
              </button>

              {expandedSections.includes('price') && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-jewelry-cream/70 mb-1">Min</label>
                      <input
                        type="number"
                        value={priceRangeInput[0]}
                        onChange={(e) => handlePriceChange(Number(e.target.value), priceRangeInput[1])}
                        className="w-full px-3 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/20 text-jewelry-cream focus:outline-none focus:ring-2 focus:ring-jewelry-gold/50"
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-jewelry-cream/70 mb-1">Max</label>
                      <input
                        type="number"
                        value={priceRangeInput[1]}
                        onChange={(e) => handlePriceChange(priceRangeInput[0], Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/20 text-jewelry-cream focus:outline-none focus:ring-2 focus:ring-jewelry-gold/50"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-jewelry-cream/70">
                      <span>₹{priceRangeInput[0].toLocaleString()}</span>
                      <span>₹{priceRangeInput[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Material Filter */}
            <div className="border-b border-jewelry-gold/10 pb-6">
              <button
                onClick={() => toggleSection('materials')}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="font-sans text-lg text-jewelry-cream font-medium">Material</span>
                {expandedSections.includes('materials') ? (
                  <ChevronUp className="w-5 h-5 text-jewelry-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-jewelry-gold" />
                )}
              </button>

              {expandedSections.includes('materials') && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {materialTypes.map(material => (
                    <div key={material.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`material-${material.id}`}
                        checked={filters.materials.includes(material.id)}
                        onChange={() => toggleMaterial(material.id)}
                        className="w-4 h-4 text-jewelry-gold bg-jewelry-dark border-jewelry-gold/30 rounded focus:ring-jewelry-gold focus:ring-2"
                      />
                      <label 
                        htmlFor={`material-${material.id}`} 
                        className="ml-2 font-sans text-jewelry-cream flex items-center"
                      >
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: material.color }}></span>
                        {material.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stone Type Filter */}
            <div className="border-b border-jewelry-gold/10 pb-6">
              <button
                onClick={() => toggleSection('stones')}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="font-sans text-lg text-jewelry-cream font-medium">Stone Type</span>
                {expandedSections.includes('stones') ? (
                  <ChevronUp className="w-5 h-5 text-jewelry-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-jewelry-gold" />
                )}
              </button>

              {expandedSections.includes('stones') && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {stoneTypes.map(stone => (
                    <div key={stone.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`stone-${stone.id}`}
                        checked={filters.stones.includes(stone.id)}
                        onChange={() => toggleStone(stone.id)}
                        className="w-4 h-4 text-jewelry-gold bg-jewelry-dark border-jewelry-gold/30 rounded focus:ring-jewelry-gold focus:ring-2"
                      />
                      <label 
                        htmlFor={`stone-${stone.id}`} 
                        className="ml-2 font-sans text-jewelry-cream flex items-center"
                      >
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: stone.color }}></span>
                        {stone.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-jewelry-gold/10 pb-6">
              <button
                onClick={() => toggleSection('colors')}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <span className="font-sans text-lg text-jewelry-cream font-medium">Color</span>
                {expandedSections.includes('colors') ? (
                  <ChevronUp className="w-5 h-5 text-jewelry-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-jewelry-gold" />
                )}
              </button>

              {expandedSections.includes('colors') && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {colorOptions.map(color => (
                    <div key={color.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`color-${color.id}`}
                        checked={filters.colors.includes(color.id)}
                        onChange={() => toggleColor(color.id)}
                        className="w-4 h-4 text-jewelry-gold bg-jewelry-dark border-jewelry-gold/30 rounded focus:ring-jewelry-gold focus:ring-2"
                      />
                      <label 
                        htmlFor={`color-${color.id}`} 
                        className="ml-2 font-sans text-jewelry-cream flex items-center"
                      >
                        <span className="w-4 h-4 rounded-full mr-2 border border-jewelry-cream/30" style={{ backgroundColor: color.color }}></span>
                        {color.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Filters */}
            <div className="pb-6">
              <h3 className="font-sans text-lg text-jewelry-cream font-medium mb-4">Special</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-jewelry-gold mr-2" />
                    <span className="font-sans text-jewelry-cream">Bestsellers</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bestsellers}
                      onChange={(e) => setFilters({...filters, bestsellers: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-jewelry-gold/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-jewelry-gold"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-jewelry-rose mr-2" />
                    <span className="font-sans text-jewelry-cream">New Arrivals</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.newArrivals}
                      onChange={(e) => setFilters({...filters, newArrivals: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-jewelry-gold/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-jewelry-gold"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={clearAllFilters}
              className="w-full py-3 px-4 rounded-xl border border-jewelry-gold/30 text-jewelry-cream font-sans font-medium hover:bg-jewelry-gold/10 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={applyFilters}
              className="w-full py-3 px-4 rounded-xl bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;