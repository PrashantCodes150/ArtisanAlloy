// STRATEGIC CATEGORY DATA
// This structure is based on the "officer-level founder" plan.

import {
    PartyPopper,
    Briefcase,
    Heart,
    Sparkles,
    Gem,
    Users,
    Gift,
    ShoppingBag,
    Crown,
    Feather,
    Sun,
    Moon,
    Tornado,
    Palette
} from 'lucide-react';

// Reusing existing images and adding placeholders for new concepts
import weddingImg from '../assets/images/hero.png';
import partyImg from '../assets/images/necklace.png';
import officeImg from '../assets/images/bracelet.png';
import festivalImg from '../assets/images/neck-jewelry.png';
import dailyImg from '../assets/images/rings.png';
import collegeImg from '../assets/images/symbolic-jewelry.png';

import bossLadyImg from '../assets/images/arms-jewelry.png';
import softGirlImg from '../assets/images/waist-jewelry.png';
import royalRaniImg from '../assets/images/egypt.png';
import bohoImg from '../assets/images/africa.png';
import streetStyleImg from '../assets/images/china.png';

import roseGoldImg from '../assets/images/greece.png';
import silverImg from '../assets/images/rome.png';
import adImg from '../assets/images/indus-valley.png';
import kundanImg from '../assets/images/medieval.png';
import templeImg from '../assets/images/mesopotamia.png';
import oxidizedImg from '../assets/images/modern.png';
import pearlImg from '../assets/images/legs-jewelry.png';

import sareeImg from '../assets/images/africa.png';
import lehengaImg from '../assets/images/china.png';
import westernImg from '../assets/images/greece.png';
import indoWesternImg from '../assets/images/rome.png';

import koreanImg from '../assets/images/indus-valley.png';
import evilEyeImg from '../assets/images/medieval.png';
import butterflyImg from '../assets/images/mesopotamia.png';
import bollywoodImg from '../assets/images/modern.png';

import giftBoxImg from '../assets/images/legs-jewelry.png';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    type: 'occasion' | 'personality' | 'material' | 'outfit' | 'budget' | 'viral' | 'gifting' | 'jewelry-type';
    icon?: React.ComponentType<any>;
}

// =================================================================================
// 1. OCCASION-BASED JEWELLERY (Super Powerful)
// =================================================================================
export const occasionCategories: Category[] = [
    { id: 'occ-wedding', name: 'Wedding Edit', slug: 'wedding-edit', image: weddingImg, description: 'For the main event', type: 'occasion', icon: Heart },
    { id: 'occ-haldi', name: 'Haldi/Mehendi', slug: 'haldi-mehendi', image: festivalImg, description: 'Vibrant pre-wedding looks', type: 'occasion', icon: Sun },
    { id: 'occ-cocktail', name: 'Party & Cocktail', slug: 'party-cocktail', image: partyImg, description: 'Dazzle after dark', type: 'occasion', icon: PartyPopper },
    { id: 'occ-office', name: 'Office/Minimal', slug: 'office-minimal', image: officeImg, description: 'Power dressing essentials', type: 'occasion', icon: Briefcase },
    { id: 'occ-festival', name: 'Festival Collection', slug: 'festival-collection', image: festivalImg, description: 'Celebrate in style', type: 'occasion', icon: Sparkles },
    { id: 'occ-daily', name: 'Daily Casual', slug: 'daily-casual', image: dailyImg, description: 'Your everyday sparkle', type: 'occasion', icon: ShoppingBag },
    { id: 'occ-college', name: 'College Essentials', slug: 'college-essentials', image: collegeImg, description: 'Effortless campus style', type: 'occasion', icon: Users },
];

// =================================================================================
// 2. PERSONALITY-BASED COLLECTIONS (Brand Differentiation)
// =================================================================================
export const personalityCategories: Category[] = [
    { id: 'pers-boss', name: 'Boss Lady', slug: 'boss-lady', image: bossLadyImg, description: 'Strong, bold, geometric', type: 'personality', icon: Crown },
    { id: 'pers-soft', name: 'Soft Girl', slug: 'soft-girl', image: softGirlImg, description: 'Pastel, pearls, floral', type: 'personality', icon: Feather },
    { id: 'pers-royal', name: 'Royal Rani', slug: 'royal-rani', image: royalRaniImg, description: 'Kundan, polki, rani haar', type: 'personality', icon: Gem },
    { id: 'pers-boho', name: 'Boho Gypsy', slug: 'boho-gypsy', image: bohoImg, description: 'Layered, oxidised, earthy', type: 'personality', icon: Moon },
    { id: 'pers-minimal', name: 'Minimal Everyday', slug: 'minimal-everyday', image: dailyImg, description: 'Tiny studs, micro pendants', type: 'personality', icon: Sun },
    { id: 'pers-street', name: 'Street Style Diva', slug: 'street-style-diva', image: streetStyleImg, description: 'Chunky chains, statement metals', type: 'personality', icon: Tornado },
];

// =================================================================================
// 3. MATERIAL-TYPE EXCLUSIVES (Trust-Building)
// =================================================================================
export const materialCategories: Category[] = [
    { id: 'mat-rosegold', name: 'Rose Gold Polish', slug: 'rose-gold-polish', image: roseGoldImg, description: 'Luxurious rose gold finish', type: 'material', icon: Palette },
    { id: 'mat-silver', name: 'Silver Anti-Tarnish', slug: 'silver-anti-tarnish', image: silverImg, description: 'Lasting silver shine', type: 'material', icon: Sparkles },
    { id: 'mat-ad', name: 'American Diamond', slug: 'american-diamond', image: adImg, description: 'Dazzling diamond-like sparkle', type: 'material', icon: Gem },
    { id: 'mat-kundan', name: 'Handcrafted Kundan', slug: 'handcrafted-kundan', image: kundanImg, description: 'Traditional glass-inlay art', type: 'material', icon: Crown },
    { id: 'mat-temple', name: 'Temple Jewellery', slug: 'temple-jewellery', image: templeImg, description: 'Divine, intricate designs', type: 'material', icon: Sun },
    { id: 'mat-oxidized', name: 'Oxidised Silver', slug: 'oxidised-silver', image: oxidizedImg, description: 'Earthy, bohemian vibe', type: 'material', icon: Moon },
    { id: 'mat-pearl', name: 'Shell & Pearl', slug: 'shell-pearl', image: pearlImg, description: 'Classic, elegant pearls', type: 'material', icon: Feather },
];

// =================================================================================
// 4. OUTFIT-BASED CURATION (Conversion Hack)
// =================================================================================
export const outfitCategories: Category[] = [
    { id: 'outfit-saree', name: 'For Sarees', slug: 'for-sarees', image: sareeImg, description: 'Perfect match for six yards', type: 'outfit', icon: Palette },
    { id: 'outfit-lehenga', name: 'For Lehengas', slug: 'for-lehengas', image: lehengaImg, description: 'Complement your lehenga look', type: 'outfit', icon: Crown },
    { id: 'outfit-western', name: 'For Western Wear', slug: 'for-western-wear', image: westernImg, description: 'Accessorize your modern fits', type: 'outfit', icon: Briefcase },
    { id: 'outfit-indowestern', name: 'For Indo-Western', slug: 'for-indo-western', image: indoWesternImg, description: 'The best of both worlds', type: 'outfit', icon: Sun },
];

// =================================================================================
// 5. BUDGET-BASED CATEGORIES (Weapon for Indian Audience)
// =================================================================================
export const budgetCategories: Category[] = [
    { id: 'bud-199', name: 'Under ₹199', slug: 'under-199', image: dailyImg, description: 'Chic finds on a dime', type: 'budget' },
    { id: 'bud-299', name: 'Under ₹299', slug: 'under-299', image: collegeImg, description: 'Affordable trends', type: 'budget' },
    { id: 'bud-499', name: 'Under ₹499', slug: 'under-499', image: partyImg, description: 'Best value party picks', type: 'budget' },
    { id: 'bud-999', name: 'Premium Under ₹999', slug: 'premium-under-999', image: weddingImg, description: 'Affordable luxury', type: 'budget' },
];

// =================================================================================
// 6. UNIQUE VIRAL CATEGORIES (Instagram Trend-Based)
// =================================================================================
export const viralCategories: Category[] = [
    { id: 'viral-korean', name: 'Korean Jewellery', slug: 'korean-jewellery', image: koreanImg, description: 'As seen in K-Dramas', type: 'viral' },
    { id: 'viral-evil-eye', name: 'Evil Eye Collection', slug: 'evil-eye-collection', image: evilEyeImg, description: 'Protection & Style', type: 'viral' },
    { id: 'viral-butterfly', name: 'Butterfly Collection', slug: 'butterfly-collection', image: butterflyImg, description: 'Whimsical & Trendy', type: 'viral' },
    { id: 'viral-bollywood', name: 'Bollywood Inspired', slug: 'bollywood-inspired', image: bollywoodImg, description: 'Get the celebrity look', type: 'viral' },
];

// =================================================================================
// 7. GIFT-BASED COLLECTION (High Margin)
// =================================================================================
export const giftCategories: Category[] = [
    { id: 'gift-boxes', name: 'Curated Gift Boxes', slug: 'gift-boxes', image: giftBoxImg, description: 'The perfect present, ready to give', type: 'gifting', icon: Gift },
    { id: 'gift-couple', name: 'Couple Sets', slug: 'couple-sets', image: weddingImg, description: 'Celebrate your connection', type: 'gifting', icon: Heart },
    { id: 'gift-anniversary', name: 'Anniversary Specials', slug: 'anniversary-specials', image: partyImg, description: 'Mark the milestone', type: 'gifting', icon: Sparkles },
];

// =================================================================================
// MASTER LIST FOR FILTERING UI
// =================================================================================
export const categoryTypes = [
    { title: 'Occasion', categories: occasionCategories },
    { title: 'Personality', categories: personalityCategories },
    { title: 'Material', categories: materialCategories },
    { title: 'Style With', categories: outfitCategories },
    { title: 'Price Point', categories: budgetCategories },
    { title: 'As Seen On', categories: viralCategories },
    { title: 'Gifting', categories: giftCategories },
];

// =================================================================================
// FINAL STRATEGIC STRUCTURE (For Top Navigation / Homepage)
// =================================================================================
export const topNavCategories: Category[] = [
    { id: 'nav-new', name: 'New Arrivals', slug: 'new-arrivals', image: partyImg, description: 'The freshest styles', type: 'jewelry-type' },
    { id: 'nav-bestsellers', name: 'Best Sellers', slug: 'bestsellers', image: weddingImg, description: 'Customer-approved favorites', type: 'jewelry-type' },
    { id: 'nav-occasion', name: 'Occasion Wear', slug: 'occasion-wear', image: festivalImg, description: 'For every event', type: 'occasion' },
    { id: 'nav-minimal', name: 'Minimal Essentials', slug: 'minimal-essentials', image: dailyImg, description: 'Subtle everyday elegance', type: 'personality' },
    { id: 'nav-bridal', name: 'Bridal Edit', slug: 'bridal-edit', image: royalRaniImg, description: 'For your special day', type: 'occasion' },
    { id: 'nav-trendy', name: 'Reels Collection', slug: 'reels-collection', image: streetStyleImg, description: 'Viral & Trending now', type: 'viral' },
    { id: 'nav-budget', name: 'Budget Friendly', slug: 'budget-friendly', image: collegeImg, description: 'Style under 499', type: 'budget' },
    { id: 'nav-gifts', name: 'Gift Boxes', slug: 'gift-boxes', image: giftBoxImg, description: 'Thoughtful, curated gifts', type: 'gifting' },
    { id: 'nav-premium', name: 'Premium Collection', slug: 'premium-collection', image: kundanImg, description: 'Kundan, AD & more', type: 'material' },
];

export const allCategories: Category[] = [
    ...occasionCategories,
    ...personalityCategories,
    ...materialCategories,
    ...outfitCategories,
    ...budgetCategories,
    ...viralCategories,
    ...giftCategories,
];

export default categoryTypes;
