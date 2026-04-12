// STRATEGIC PRODUCT DATA
import p1 from '../assets/images/products/prod_01.jpg';
import p2 from '../assets/images/products/prod_02.jpg';
import p3 from '../assets/images/products/prod_03.jpg';
import p4 from '../assets/images/products/prod_04.jpg';
import p5 from '../assets/images/products/prod_05.jpg';
import p6 from '../assets/images/products/prod_06.jpg';
import p7 from '../assets/images/products/prod_07.jpg';
import p8 from '../assets/images/products/prod_08.jpg';
import p9 from '../assets/images/products/prod_09.jpg';
import p10 from '../assets/images/products/prod_10.jpg';
import p11 from '../assets/images/products/prod_11.jpg';
import p12 from '../assets/images/products/prod_12.jpg';
import p13 from '../assets/images/products/prod_13.jpg';
import p14 from '../assets/images/products/prod_14.jpg';
import p15 from '../assets/images/products/prod_15.jpg';

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    isNew: boolean;
    isBestseller: boolean;
    description: string;
    // Strategic categories
    occasion: string[];
    personality: string[];
    material: string[];
    outfit: string[];
    viral: string[];
    gifting: string[];
    keywords: string[];
}

export const products: Product[] = [
    {
        id: 'prod-001',
        name: 'The CEO Hoops',
        slug: 'the-ceo-hoops',
        price: 499,
        originalPrice: 799,
        image: p1,
        occasion: ['occ-office', 'occ-daily'],
        personality: ['pers-boss'],
        material: ['mat-rosegold'],
        outfit: ['outfit-western'],
        viral: [],
        gifting: [],
        keywords: ['bold hoops', 'office wear', 'geometric'],
        rating: 4.8,
        reviews: 150,
        inStock: true,
        isNew: false,
        isBestseller: true,
        description: 'Command the room with these sharp, geometric rose gold hoops. The ultimate power accessory for the modern leader.'
    },
    {
        id: 'prod-002',
        name: 'Royal Kundan Rani Haar',
        slug: 'royal-kundan-rani-haar',
        price: 1899,
        originalPrice: 2499,
        image: p2,
        occasion: ['occ-wedding', 'occ-festival'],
        personality: ['pers-royal'],
        material: ['mat-kundan', 'mat-pearl'],
        outfit: ['outfit-lehenga', 'outfit-saree'],
        viral: [],
        gifting: ['gift-anniversary'],
        keywords: ['rani haar', 'bridal', 'kundan set', 'wedding'],
        rating: 4.9,
        reviews: 210,
        inStock: true,
        isNew: false,
        isBestseller: true,
        description: 'A majestic Kundan Rani Haar, handcrafted for the queen in you. Perfect for weddings and grand celebrations.'
    },
    {
        id: 'prod-003',
        name: 'First Date Pearl Drops',
        slug: 'first-date-pearl-drops',
        price: 299,
        image: p3,
        occasion: ['occ-daily', 'occ-college'],
        personality: ['pers-soft'],
        material: ['mat-pearl', 'mat-silver'],
        outfit: ['outfit-western', 'outfit-indowestern'],
        viral: ['viral-korean'],
        gifting: [],
        keywords: ['pearl earrings', 'soft girl', 'minimal', 'korean style'],
        rating: 4.7,
        reviews: 320,
        inStock: true,
        isNew: true,
        isBestseller: false,
        description: 'Delicate pearl drops that whisper elegance. The perfect touch for a soft, romantic, and effortlessly chic look.'
    },
    {
        id: 'prod-004',
        name: 'Gypsy Soul Layered Chains',
        slug: 'gypsy-soul-layered-chains',
        price: 399,
        originalPrice: 599,
        image: p4,
        occasion: ['occ-daily', 'occ-college'],
        personality: ['pers-boho'],
        material: ['mat-oxidized'],
        outfit: ['outfit-indowestern'],
        viral: [],
        gifting: [],
        keywords: ['boho necklace', 'layered', 'oxidised silver', 'gypsy'],
        rating: 4.6,
        reviews: 180,
        inStock: true,
        isNew: false,
        isBestseller: false,
        description: 'Unleash your inner wanderer with these earthy, layered oxidized chains. A must-have for every bohemian heart.'
    },
    {
        id: 'prod-005',
        name: 'Cocktail Night Dangler Earrings',
        slug: 'cocktail-night-dangler-earrings',
        price: 699,
        image: p5,
        occasion: ['occ-cocktail'],
        personality: ['pers-street'],
        material: ['mat-ad', 'mat-silver'],
        outfit: ['outfit-western'],
        viral: [],
        gifting: [],
        keywords: ['party earrings', 'dangles', 'american diamond', 'cocktail'],
        rating: 4.8,
        reviews: 95,
        inStock: true,
        isNew: true,
        isBestseller: false,
        description: 'Shine under the city lights with these glamorous American Diamond danglers. Your perfect partner for a night out.'
    },
    {
        id: 'prod-006',
        name: 'Haldi Bloom Floral Set',
        slug: 'haldi-bloom-floral-set',
        price: 499,
        image: p6,
        occasion: ['occ-haldi'],
        personality: ['pers-soft'],
        material: [],
        outfit: ['outfit-lehenga'],
        viral: [],
        gifting: ['gift-boxes'],
        keywords: ['haldi jewelry', 'floral', 'mehendi', 'pre-wedding'],
        rating: 4.9,
        reviews: 130,
        inStock: true,
        isNew: false,
        isBestseller: true,
        description: 'Vibrant and lightweight floral jewelry, specially designed for Haldi and Mehendi ceremonies. Look radiant and feel comfortable.'
    },
    {
        id: 'prod-007',
        name: '9-to-5 Minimalist Studs',
        slug: '9-to-5-minimalist-studs',
        price: 199,
        image: p7,
        occasion: ['occ-office', 'occ-daily'],
        personality: ['pers-minimal'],
        material: ['mat-silver'],
        outfit: ['outfit-western'],
        viral: [],
        gifting: [],
        keywords: ['office studs', 'minimalist earrings', 'daily wear', 'anti-tarnish'],
        rating: 4.7,
        reviews: 450,
        inStock: true,
        isNew: false,
        isBestseller: true,
        description: 'Your go-to everyday studs. Simple, elegant, and professional with an anti-tarnish silver polish for lasting shine.'
    },
    {
        id: 'prod-008',
        name: 'Saree-Ready Temple Jhumkas',
        slug: 'saree-ready-temple-jhumkas',
        price: 899,
        image: p8,
        occasion: ['occ-festival', 'occ-wedding'],
        personality: ['pers-royal'],
        material: ['mat-temple'],
        outfit: ['outfit-saree'],
        viral: [],
        gifting: [],
        keywords: ['jhumkas', 'temple jewellery', 'saree match', 'traditional'],
        rating: 4.9,
        reviews: 190,
        inStock: true,
        isNew: false,
        isBestseller: false,
        description: 'Intricately designed Temple Jhumkas that perfectly complement the grace of a saree. A timeless traditional piece.'
    },
    {
        id: 'prod-009',
        name: 'The "Evil Eye" Charm Bracelet',
        slug: 'evil-eye-charm-bracelet',
        price: 349,
        image: p9,
        occasion: ['occ-daily', 'occ-college'],
        personality: ['pers-boho'],
        material: ['mat-silver'],
        outfit: ['outfit-indowestern'],
        viral: ['viral-evil-eye'],
        gifting: ['gift-boxes'],
        keywords: ['evil eye', 'charm bracelet', 'protection', 'trendy'],
        rating: 4.8,
        reviews: 280,
        inStock: true,
        isNew: true,
        isBestseller: true,
        description: 'Stay protected in style. This trendy Evil Eye charm bracelet is a viral sensation and a meaningful accessory.'
    },
    {
        id: 'prod-010',
        name: 'Butterfly K-Drama Necklace',
        slug: 'butterfly-k-drama-necklace',
        price: 249,
        originalPrice: 399,
        image: p10,
        occasion: ['occ-college', 'occ-daily'],
        personality: ['pers-soft'],
        material: ['mat-rosegold'],
        outfit: ['outfit-western'],
        viral: ['viral-korean', 'viral-butterfly'],
        gifting: [],
        keywords: ['butterfly necklace', 'korean jewelry', 'k-drama', 'tiktok'],
        rating: 4.7,
        reviews: 400,
        inStock: true,
        isNew: true,
        isBestseller: false,
        description: 'As seen on your favorite K-Drama stars! This delicate butterfly necklace in rose gold is the ultimate "soft girl" accessory.'
    },
    {
        id: 'prod-011',
        name: 'Black Dress Statement Ring',
        slug: 'black-dress-statement-ring',
        price: 499,
        image: p11,
        occasion: ['occ-cocktail'],
        personality: ['pers-boss', 'pers-street'],
        material: ['mat-ad'],
        outfit: ['outfit-western'],
        viral: [],
        gifting: [],
        keywords: ['statement ring', 'cocktail ring', 'black dress'],
        rating: 4.8,
        reviews: 120,
        inStock: true,
        isNew: false,
        isBestseller: false,
        description: 'The one accessory your little black dress needs. A bold, sparkling statement ring that guarantees a second look.'
    },
    {
        id: 'prod-012',
        name: 'Bollywood Celebrity Choker',
        slug: 'bollywood-celebrity-choker',
        price: 1299,
        image: p12,
        occasion: ['occ-wedding', 'occ-cocktail'],
        personality: ['pers-royal'],
        material: ['mat-kundan', 'mat-ad'],
        outfit: ['outfit-lehenga', 'outfit-saree'],
        viral: ['viral-bollywood'],
        gifting: [],
        keywords: ['bollywood replica', 'celebrity style', 'heavy choker'],
        rating: 4.9,
        reviews: 85,
        inStock: true,
        isNew: true,
        isBestseller: false,
        description: 'Get the star look! An exquisite choker inspired by recent Bollywood celebrity wedding trends.'
    },
    {
        id: 'prod-013',
        name: 'The "Bridesmaid" Gift Box',
        slug: 'bridesmaid-gift-box',
        price: 999,
        image: p13,
        occasion: [],
        personality: [],
        material: ['mat-pearl', 'mat-rosegold'],
        outfit: [],
        viral: [],
        gifting: ['gift-boxes', 'gift-anniversary'],
        keywords: ['bridesmaid gift', 'gift set', 'curated box'],
        rating: 5.0,
        reviews: 90,
        inStock: true,
        isNew: false,
        isBestseller: true,
        description: 'The perfect "thank you" for your bridesmaids. A curated gift box with a matching pearl set in rose gold.'
    },
    {
        id: 'prod-014',
        name: 'Kurti Companion Oxidised Hoops',
        slug: 'kurti-companion-oxidised-hoops',
        price: 199,
        originalPrice: 299,
        image: p14,
        occasion: ['occ-daily', 'occ-college'],
        personality: ['pers-boho', 'pers-minimal'],
        material: ['mat-oxidized'],
        outfit: ['outfit-indowestern'],
        viral: [],
        gifting: [],
        keywords: ['kurti earrings', 'oxidised hoops', 'budget friendly'],
        rating: 4.6,
        reviews: 310,
        inStock: true,
        isNew: false,
        isBestseller: false,
        description: 'The effortless hoops that perfectly complement any kurti. Your simple, stylish, everyday solution.'
    },
    {
        id: 'prod-015',
        name: 'Indo-Western Fusion Ear Cuff',
        slug: 'indo-western-fusion-ear-cuff',
        price: 399,
        image: p15,
        occasion: ['occ-cocktail', 'occ-college'],
        personality: ['pers-street'],
        material: ['mat-silver'],
        outfit: ['outfit-indowestern'],
        viral: [],
        gifting: [],
        keywords: ['ear cuff', 'indo-western', 'fusion', 'no piercing'],
        rating: 4.7,
        reviews: 110,
        inStock: true,
        isNew: true,
        isBestseller: false,
        description: 'Edgy meets elegant. A non-piercing ear cuff that adds a fusion twist to both your Indian and Western outfits.'
    }
];

export default products;
