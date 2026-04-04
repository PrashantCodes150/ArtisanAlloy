import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Product, Category, Coupon } from '../models';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/f-jewelry';

// Categories Data
const categoriesData = [
  // Occasion Categories
  { name: 'Wedding', slug: 'wedding', type: 'occasion', description: 'Elegant wedding jewelry', order: 1, isFeatured: true, isActive: true },
  { name: 'Party', slug: 'party', type: 'occasion', description: 'Stunning party wear jewelry', order: 2, isFeatured: true, isActive: true },
  { name: 'Daily Wear', slug: 'daily-wear', type: 'occasion', description: 'Comfortable everyday jewelry', order: 3, isFeatured: true, isActive: true },
  { name: 'Festival', slug: 'festival', type: 'occasion', description: 'Traditional festival jewelry', order: 4, isFeatured: true, isActive: true },
  { name: 'Office', slug: 'office', type: 'occasion', description: 'Professional office wear jewelry', order: 5, isFeatured: false, isActive: true },
  
  // Personality Categories
  { name: 'Bold', slug: 'bold', type: 'personality', description: 'Statement pieces for bold personalities', order: 1, isFeatured: true, isActive: true },
  { name: 'Minimalist', slug: 'minimalist', type: 'personality', description: 'Simple and elegant designs', order: 2, isFeatured: true, isActive: true },
  { name: 'Vintage', slug: 'vintage', type: 'personality', description: 'Classic vintage-inspired pieces', order: 3, isFeatured: true, isActive: true },
  { name: 'Trendy', slug: 'trendy', type: 'personality', description: 'Latest fashion trends', order: 4, isFeatured: false, isActive: true },
  
  // Material Categories
  { name: 'Gold Plated', slug: 'gold-plated', type: 'material', description: 'Premium gold plated jewelry', order: 1, isFeatured: true, isActive: true },
  { name: 'Silver', slug: 'silver', type: 'material', description: 'Pure silver jewelry', order: 2, isFeatured: true, isActive: true },
  { name: 'Kundan', slug: 'kundan', type: 'material', description: 'Traditional kundan work', order: 3, isFeatured: true, isActive: true },
  { name: 'Pearl', slug: 'pearl', type: 'material', description: 'Elegant pearl jewelry', order: 4, isFeatured: false, isActive: true },
  { name: 'Meenakari', slug: 'meenakari', type: 'material', description: 'Colorful meenakari designs', order: 5, isFeatured: false, isActive: true },
  
  // Jewelry Type Categories
  { name: 'Necklaces', slug: 'necklaces', type: 'jewelry-type', description: 'Beautiful necklace sets', order: 1, isFeatured: true, isActive: true },
  { name: 'Earrings', slug: 'earrings', type: 'jewelry-type', description: 'Stunning earrings collection', order: 2, isFeatured: true, isActive: true },
  { name: 'Bangles', slug: 'bangles', type: 'jewelry-type', description: 'Traditional and modern bangles', order: 3, isFeatured: true, isActive: true },
  { name: 'Rings', slug: 'rings', type: 'jewelry-type', description: 'Elegant rings', order: 4, isFeatured: true, isActive: true },
  { name: 'Bracelets', slug: 'bracelets', type: 'jewelry-type', description: 'Stylish bracelets', order: 5, isFeatured: false, isActive: true },
  { name: 'Anklets', slug: 'anklets', type: 'jewelry-type', description: 'Beautiful anklets', order: 6, isFeatured: false, isActive: true },
  { name: 'Maang Tikka', slug: 'maang-tikka', type: 'jewelry-type', description: 'Traditional maang tikka', order: 7, isFeatured: false, isActive: true },
  
  // Gifting Categories
  { name: 'For Her', slug: 'for-her', type: 'gifting', description: 'Perfect gifts for women', order: 1, isFeatured: true, isActive: true },
  { name: 'Anniversary', slug: 'anniversary', type: 'gifting', description: 'Anniversary special jewelry', order: 2, isFeatured: true, isActive: true },
  { name: 'Birthday', slug: 'birthday', type: 'gifting', description: 'Birthday gift ideas', order: 3, isFeatured: false, isActive: true },
];

// Products Data
const productsData = [
  {
    name: 'Royal Kundan Bridal Necklace Set',
    slug: 'royal-kundan-bridal-necklace-set',
    description: 'Exquisite bridal necklace set featuring intricate kundan work with matching earrings. Perfect for weddings and special occasions. This stunning piece combines traditional craftsmanship with contemporary design.',
    shortDescription: 'Stunning kundan bridal necklace with matching earrings',
    price: 4999,
    originalPrice: 6999,
    images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', alt: 'Kundan Necklace', isPrimary: true, order: 0 }],
    sku: 'FJ-NK-001',
    stock: 15,
    occasion: ['wedding', 'festival', 'party'],
    personality: ['bold', 'vintage'],
    material: ['kundan', 'gold-plated'],
    tags: ['bridal', 'wedding', 'kundan', 'necklace set'],
    keywords: ['bridal jewelry', 'wedding necklace', 'kundan set'],
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    name: 'Elegant Pearl Drop Earrings',
    slug: 'elegant-pearl-drop-earrings',
    description: 'Classic pearl drop earrings with gold-plated finish. These versatile earrings are perfect for both casual and formal occasions. Lightweight and comfortable for all-day wear.',
    shortDescription: 'Classic pearl earrings with gold plating',
    price: 899,
    originalPrice: 1299,
    images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', alt: 'Pearl Earrings', isPrimary: true, order: 0 }],
    sku: 'FJ-ER-001',
    stock: 50,
    occasion: ['daily-wear', 'office', 'party'],
    personality: ['minimalist', 'trendy'],
    material: ['pearl', 'gold-plated'],
    tags: ['pearl', 'earrings', 'office wear', 'daily wear'],
    keywords: ['pearl earrings', 'drop earrings', 'office jewelry'],
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.6,
    reviewsCount: 89,
  },
  {
    name: 'Traditional Meenakari Bangles Set',
    slug: 'traditional-meenakari-bangles-set',
    description: 'Beautiful set of 6 meenakari bangles with intricate hand-painted designs. These colorful bangles add a traditional touch to any outfit. Available in multiple sizes.',
    shortDescription: 'Set of 6 hand-painted meenakari bangles',
    price: 1499,
    originalPrice: 1999,
    images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', alt: 'Meenakari Bangles', isPrimary: true, order: 0 }],
    sku: 'FJ-BG-001',
    stock: 30,
    occasion: ['festival', 'wedding', 'party'],
    personality: ['bold', 'vintage'],
    material: ['meenakari', 'gold-plated'],
    tags: ['bangles', 'meenakari', 'traditional', 'colorful'],
    keywords: ['meenakari bangles', 'traditional bangles', 'colorful bangles'],
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 67,
  },
  {
    name: 'Minimalist Silver Chain Necklace',
    slug: 'minimalist-silver-chain-necklace',
    description: 'Sleek and modern silver chain necklace perfect for everyday wear. This delicate piece adds subtle elegance to any outfit. Hypoallergenic and tarnish-resistant.',
    shortDescription: 'Elegant silver chain for daily wear',
    price: 699,
    originalPrice: 999,
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', alt: 'Silver Necklace', isPrimary: true, order: 0 }],
    sku: 'FJ-NK-002',
    stock: 75,
    occasion: ['daily-wear', 'office'],
    personality: ['minimalist'],
    material: ['silver'],
    tags: ['silver', 'chain', 'minimalist', 'daily wear'],
    keywords: ['silver necklace', 'chain necklace', 'minimalist jewelry'],
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.4,
    reviewsCount: 45,
  },
  {
    name: 'Statement Oxidized Silver Jhumkas',
    slug: 'statement-oxidized-silver-jhumkas',
    description: 'Bold oxidized silver jhumkas with intricate tribal-inspired designs. These statement earrings are perfect for those who love to stand out. Lightweight despite their size.',
    shortDescription: 'Bold oxidized silver jhumka earrings',
    price: 1199,
    originalPrice: 1599,
    images: [{ url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500', alt: 'Oxidized Jhumkas', isPrimary: true, order: 0 }],
    sku: 'FJ-ER-002',
    stock: 40,
    occasion: ['festival', 'party'],
    personality: ['bold', 'vintage'],
    material: ['silver'],
    tags: ['jhumkas', 'oxidized', 'statement', 'traditional'],
    keywords: ['jhumka earrings', 'oxidized silver', 'statement earrings'],
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.7,
    reviewsCount: 156,
  },
  {
    name: 'Delicate Gold Plated Anklet',
    slug: 'delicate-gold-plated-anklet',
    description: 'Dainty gold-plated anklet with small bell charms. This traditional piece adds a musical touch to your steps. Adjustable size fits most.',
    shortDescription: 'Traditional anklet with bell charms',
    price: 499,
    originalPrice: 699,
    images: [{ url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500', alt: 'Gold Anklet', isPrimary: true, order: 0 }],
    sku: 'FJ-AK-001',
    stock: 60,
    occasion: ['daily-wear', 'festival'],
    personality: ['minimalist', 'trendy'],
    material: ['gold-plated'],
    tags: ['anklet', 'gold', 'bells', 'traditional'],
    keywords: ['gold anklet', 'payal', 'traditional anklet'],
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.3,
    reviewsCount: 34,
  },
  {
    name: 'Layered Pearl Choker Set',
    slug: 'layered-pearl-choker-set',
    description: 'Elegant three-layer pearl choker with matching earrings. This sophisticated set is perfect for special occasions and makes a wonderful gift. Adjustable clasp for comfortable fit.',
    shortDescription: 'Three-layer pearl choker with earrings',
    price: 2499,
    originalPrice: 3499,
    images: [{ url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500', alt: 'Pearl Choker', isPrimary: true, order: 0 }],
    sku: 'FJ-NK-003',
    stock: 25,
    occasion: ['wedding', 'party'],
    personality: ['trendy', 'bold'],
    material: ['pearl', 'gold-plated'],
    tags: ['choker', 'pearl', 'layered', 'set'],
    keywords: ['pearl choker', 'layered necklace', 'wedding jewelry'],
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 78,
  },
  {
    name: 'Classic Solitaire Ring',
    slug: 'classic-solitaire-ring',
    description: 'Timeless solitaire ring with sparkling cubic zirconia stone. This elegant ring is perfect for engagements or as a special gift. Available in multiple sizes.',
    shortDescription: 'Elegant solitaire ring with CZ stone',
    price: 1799,
    originalPrice: 2499,
    images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', alt: 'Solitaire Ring', isPrimary: true, order: 0 }],
    sku: 'FJ-RG-001',
    stock: 35,
    occasion: ['party', 'daily-wear'],
    personality: ['minimalist', 'trendy'],
    material: ['silver', 'gold-plated'],
    tags: ['ring', 'solitaire', 'engagement', 'gift'],
    keywords: ['solitaire ring', 'engagement ring', 'cz ring'],
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    rating: 4.6,
    reviewsCount: 112,
  },
  {
    name: 'Antique Temple Necklace',
    slug: 'antique-temple-necklace',
    description: 'Magnificent temple-style necklace inspired by South Indian designs. Features intricate deity motifs and traditional craftsmanship. A statement piece for traditional occasions.',
    shortDescription: 'South Indian temple style necklace',
    price: 5999,
    originalPrice: 7999,
    images: [{ url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=500', alt: 'Temple Necklace', isPrimary: true, order: 0 }],
    sku: 'FJ-NK-004',
    stock: 10,
    occasion: ['wedding', 'festival'],
    personality: ['bold', 'vintage'],
    material: ['gold-plated'],
    tags: ['temple', 'south indian', 'antique', 'bridal'],
    keywords: ['temple jewelry', 'south indian necklace', 'antique necklace'],
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    rating: 4.8,
    reviewsCount: 45,
  },
  {
    name: 'Charm Bracelet Collection',
    slug: 'charm-bracelet-collection',
    description: 'Playful charm bracelet with interchangeable charms. Customize your look with this versatile piece. Includes 5 starter charms with option to add more.',
    shortDescription: 'Customizable charm bracelet with 5 charms',
    price: 999,
    originalPrice: 1499,
    images: [{ url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500', alt: 'Charm Bracelet', isPrimary: true, order: 0 }],
    sku: 'FJ-BR-001',
    stock: 45,
    occasion: ['daily-wear', 'party'],
    personality: ['trendy', 'minimalist'],
    material: ['silver', 'gold-plated'],
    tags: ['bracelet', 'charms', 'customizable', 'gift'],
    keywords: ['charm bracelet', 'gift bracelet', 'customizable jewelry'],
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.4,
    reviewsCount: 67,
  },
  {
    name: 'Bridal Maang Tikka',
    slug: 'bridal-maang-tikka',
    description: 'Stunning bridal maang tikka with kundan stones and pearl drops. This centerpiece accessory completes any bridal look. Adjustable chain for perfect fit.',
    shortDescription: 'Kundan maang tikka with pearl drops',
    price: 1299,
    originalPrice: 1799,
    images: [{ url: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=500', alt: 'Maang Tikka', isPrimary: true, order: 0 }],
    sku: 'FJ-MT-001',
    stock: 20,
    occasion: ['wedding', 'festival'],
    personality: ['bold', 'vintage'],
    material: ['kundan', 'pearl', 'gold-plated'],
    tags: ['maang tikka', 'bridal', 'kundan', 'pearl'],
    keywords: ['maang tikka', 'bridal accessory', 'wedding jewelry'],
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.7,
    reviewsCount: 38,
  },
  {
    name: 'Modern Geometric Earrings',
    slug: 'modern-geometric-earrings',
    description: 'Contemporary geometric earrings with clean lines and modern appeal. These lightweight earrings are perfect for the fashion-forward woman. Nickel-free for sensitive ears.',
    shortDescription: 'Contemporary geometric design earrings',
    price: 599,
    originalPrice: 899,
    images: [{ url: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500', alt: 'Geometric Earrings', isPrimary: true, order: 0 }],
    sku: 'FJ-ER-003',
    stock: 55,
    occasion: ['office', 'daily-wear', 'party'],
    personality: ['minimalist', 'trendy'],
    material: ['gold-plated'],
    tags: ['geometric', 'modern', 'office wear', 'trendy'],
    keywords: ['geometric earrings', 'modern earrings', 'office earrings'],
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    rating: 4.5,
    reviewsCount: 52,
  },
];

// Coupons Data
const couponsData = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'Welcome discount for new customers',
    minOrderAmount: 999,
    maxDiscount: 500,
    usageLimit: 1000,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    isActive: true,
  },
  {
    code: 'FLAT200',
    type: 'fixed',
    value: 200,
    description: 'Flat ₹200 off on orders above ₹1499',
    minOrderAmount: 1499,
    usageLimit: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    isActive: true,
  },
  {
    code: 'BRIDAL20',
    type: 'percentage',
    value: 20,
    description: '20% off on bridal jewelry',
    minOrderAmount: 2999,
    maxDiscount: 2000,
    usageLimit: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
    isActive: true,
  },
];

// Admin User
const adminUserData = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@fjewelry.com',
  password: 'Admin@123',
  role: 'admin',
  isEmailVerified: true,
  isActive: true,
};

// Test Customer
const testUserData = {
  firstName: 'Test',
  lastName: 'Customer',
  email: 'test@example.com',
  password: 'Test@123',
  role: 'customer',
  isEmailVerified: true,
  isActive: true,
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared\n');

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Get jewelry-type category for products
    const necklaceCategory = categories.find(c => c.slug === 'necklaces');
    const earringsCategory = categories.find(c => c.slug === 'earrings');
    const banglesCategory = categories.find(c => c.slug === 'bangles');
    const ringsCategory = categories.find(c => c.slug === 'rings');
    const braceletsCategory = categories.find(c => c.slug === 'bracelets');
    const ankletsCategory = categories.find(c => c.slug === 'anklets');
    const maangTikkaCategory = categories.find(c => c.slug === 'maang-tikka');

    // Assign categories to products
    const productsWithCategories = productsData.map((product, index) => {
      let category;
      if (product.slug.includes('necklace') || product.slug.includes('choker')) {
        category = necklaceCategory?._id;
      } else if (product.slug.includes('earring') || product.slug.includes('jhumka')) {
        category = earringsCategory?._id;
      } else if (product.slug.includes('bangle')) {
        category = banglesCategory?._id;
      } else if (product.slug.includes('ring')) {
        category = ringsCategory?._id;
      } else if (product.slug.includes('bracelet')) {
        category = braceletsCategory?._id;
      } else if (product.slug.includes('anklet')) {
        category = ankletsCategory?._id;
      } else if (product.slug.includes('tikka')) {
        category = maangTikkaCategory?._id;
      } else {
        category = necklaceCategory?._id;
      }
      
      return { ...product, category };
    });

    // Seed Products
    console.log('💎 Seeding products...');
    const products = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${products.length} products\n`);

    // Update category product counts
    console.log('🔄 Updating category product counts...');
    for (const category of categories) {
      const count = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productsCount: count });
    }
    console.log('✅ Category counts updated\n');

    // Seed Coupons
    console.log('🎟️  Seeding coupons...');
    const coupons = await Coupon.insertMany(couponsData);
    console.log(`✅ Created ${coupons.length} coupons\n`);

    // Seed Admin User
    console.log('👤 Creating admin user...');
    const hashedAdminPassword = await bcrypt.hash(adminUserData.password, 12);
    await User.create({ ...adminUserData, password: hashedAdminPassword });
    console.log('✅ Admin user created (admin@fjewelry.com / Admin@123)\n');

    // Seed Test User
    console.log('👤 Creating test user...');
    const hashedTestPassword = await bcrypt.hash(testUserData.password, 12);
    await User.create({ ...testUserData, password: hashedTestPassword });
    console.log('✅ Test user created (test@example.com / Test@123)\n');

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('📊 Summary:');
    console.log(`   • ${categories.length} categories`);
    console.log(`   • ${products.length} products`);
    console.log(`   • ${coupons.length} coupons`);
    console.log(`   • 2 users (1 admin, 1 customer)\n`);
    
    console.log('🔐 Login Credentials:');
    console.log('   Admin: admin@fjewelry.com / Admin@123');
    console.log('   Test:  test@example.com / Test@123\n');
    
    console.log('🎟️  Available Coupons:');
    couponsData.forEach(coupon => {
      console.log(`   • ${coupon.code} - ${coupon.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
