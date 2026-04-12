import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the products images directory if it doesn't exist
const productsDir = path.join(__dirname, 'src', 'assets', 'images', 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Define jewelry types with descriptions for more meaningful SVGs
const jewelryTypes = [
    { name: 'Hoops', color: '#FFD700', shape: 'circle' }, // Gold hoops
    { name: 'Haar', color: '#FFD700', shape: 'pendant' }, // Gold pendant
    { name: 'Pearl Drops', color: '#F5F5DC', shape: 'drop' }, // Pearl earrings
    { name: 'Chains', color: '#C0C0C0', shape: 'chain' }, // Silver chain
    { name: 'Dangler Earrings', color: '#FFD700', shape: 'dangler' }, // Gold dangler
    { name: 'Floral Set', color: '#FF69B4', shape: 'flower' }, // Pink floral
    { name: 'Studs', color: '#C0C0C0', shape: 'stud' }, // Silver studs
    { name: 'Jhumkas', color: '#FFD700', shape: 'jhumka' }, // Gold jhumka
    { name: 'Bracelet', color: '#C0C0C0', shape: 'bracelet' }, // Silver bracelet
    { name: 'Necklace', color: '#FFD700', shape: 'heart' }, // Gold heart necklace
    { name: 'Ring', color: '#FFD700', shape: 'ring' }, // Gold ring
    { name: 'Choker', color: '#FF69B4', shape: 'choker' }, // Pink choker
    { name: 'Gift Box', color: '#FF69B4', shape: 'box' }, // Pink gift box
    { name: 'Hoops', color: '#C0C0C0', shape: 'small_hoops' }, // Silver hoops
    { name: 'Ear Cuff', color: '#C0C0C0', shape: 'cuff' } // Silver ear cuff
];

// Generate SVG content for each jewelry type
jewelryTypes.forEach((jewelry, index) => {
    const svgContent = generateJewelrySVG(jewelry, index + 1);
    const fileName = `prod_${String(index + 1).padStart(2, '0')}.svg`;
    const filePath = path.join(productsDir, fileName);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Generated ${fileName}`);
});

function generateJewelrySVG(jewelry, index) {
    let shapeSVG = '';
    
    switch(jewelry.shape) {
        case 'circle':
            // Hoops
            shapeSVG = `
                <circle cx="100" cy="100" r="60" stroke="${jewelry.color}" stroke-width="15" fill="none"/>
                <circle cx="100" cy="100" r="40" stroke="${jewelry.color}" stroke-width="10" fill="none"/>`;
            break;
        case 'pendant':
            // Pendant necklace
            shapeSVG = `
                <line x1="100" y1="30" x2="100" y2="60" stroke="${jewelry.color}" stroke-width="5"/>
                <path d="M 70 60 Q 100 120 130 60" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="100" cy="90" r="20" fill="${jewelry.color}"/>`;
            break;
        case 'drop':
            // Pearl drop earrings
            shapeSVG = `
                <circle cx="80" cy="70" r="15" fill="${jewelry.color}"/>
                <line x1="80" y1="55" x2="80" y2="30" stroke="${jewelry.color}" stroke-width="3"/>
                <circle cx="120" cy="70" r="15" fill="${jewelry.color}"/>
                <line x1="120" y1="55" x2="120" y2="30" stroke="${jewelry.color}" stroke-width="3"/>
                <circle cx="80" cy="100" r="25" fill="#F5F5DC"/>
                <circle cx="120" cy="100" r="25" fill="#F5F5DC"/>`;
            break;
        case 'chain':
            // Chain necklace
            shapeSVG = `
                <path d="M 30 100 Q 60 80 90 100 T 150 100" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="45" cy="100" r="5" fill="${jewelry.color}"/>
                <circle cx="75" cy="100" r="5" fill="${jewelry.color}"/>
                <circle cx="105" cy="100" r="5" fill="${jewelry.color}"/>
                <circle cx="135" cy="100" r="5" fill="${jewelry.color}"/>`;
            break;
        case 'dangler':
            // Dangler earrings
            shapeSVG = `
                <circle cx="80" cy="40" r="8" fill="${jewelry.color}"/>
                <circle cx="120" cy="40" r="8" fill="${jewelry.color}"/>
                <line x1="80" y1="48" x2="80" y2="80" stroke="${jewelry.color}" stroke-width="3"/>
                <line x1="120" y1="48" x2="120" y2="80" stroke="${jewelry.color}" stroke-width="3"/>
                <rect x="70" y="80" width="20" height="40" rx="10" fill="${jewelry.color}"/>
                <rect x="110" y="80" width="20" height="40" rx="10" fill="${jewelry.color}"/>`;
            break;
        case 'flower':
            // Floral jewelry
            shapeSVG = `
                <circle cx="100" cy="100" r="15" fill="#FF69B4"/>
                <circle cx="85" cy="85" r="12" fill="#FFB6C1"/>
                <circle cx="115" cy="85" r="12" fill="#FFB6C1"/>
                <circle cx="85" cy="115" r="12" fill="#FFB6C1"/>
                <circle cx="115" cy="115" r="12" fill="#FFB6C1"/>
                <circle cx="100" cy="70" r="12" fill="#FFB6C1"/>
                <circle cx="100" cy="130" r="12" fill="#FFB6C1"/>`;
            break;
        case 'stud':
            // Stud earrings
            shapeSVG = `
                <circle cx="80" cy="100" r="20" fill="${jewelry.color}"/>
                <circle cx="120" cy="100" r="20" fill="${jewelry.color}"/>
                <circle cx="80" cy="100" r="8" fill="#FFFFFF" opacity="0.7"/>
                <circle cx="120" cy="100" r="8" fill="#FFFFFF" opacity="0.7"/>`;
            break;
        case 'jhumka':
            // Jhumka earrings
            shapeSVG = `
                <ellipse cx="80" cy="100" rx="25" ry="35" fill="${jewelry.color}"/>
                <ellipse cx="120" cy="100" rx="25" ry="35" fill="${jewelry.color}"/>
                <circle cx="80" cy="80" r="10" fill="#FFD700"/>
                <circle cx="120" cy="80" r="10" fill="#FFD700"/>
                <circle cx="80" cy="100" r="5" fill="#FFFFFF"/>
                <circle cx="120" cy="100" r="5" fill="#FFFFFF"/>`;
            break;
        case 'bracelet':
            // Bracelet
            shapeSVG = `
                <path d="M 50 100 Q 100 60 150 100" stroke="${jewelry.color}" stroke-width="20" fill="none"/>
                <circle cx="70" cy="95" r="6" fill="#FFD700"/>
                <circle cx="90" cy="90" r="6" fill="#FFD700"/>
                <circle cx="110" cy="90" r="6" fill="#FFD700"/>
                <circle cx="130" cy="95" r="6" fill="#FFD700"/>`;
            break;
        case 'heart':
            // Heart necklace
            shapeSVG = `
                <path d="M 100 60 C 80 40, 60 60, 60 80 C 60 100, 100 130, 100 130 C 100 130, 140 100, 140 80 C 140 60, 120 40, 100 60 Z" fill="${jewelry.color}"/>
                <line x1="100" y1="30" x2="100" y2="60" stroke="${jewelry.color}" stroke-width="5"/>`;
            break;
        case 'ring':
            // Ring
            shapeSVG = `
                <circle cx="100" cy="100" r="40" stroke="${jewelry.color}" stroke-width="15" fill="none"/>
                <circle cx="100" cy="100" r="30" stroke="#C0C0C0" stroke-width="5" fill="none"/>
                <circle cx="100" cy="80" r="10" fill="#4169E1"/>`;
            break;
        case 'choker':
            // Choker
            shapeSVG = `
                <rect x="50" y="90" width="100" height="20" rx="10" fill="${jewelry.color}"/>
                <circle cx="100" cy="85" r="15" fill="#FF69B4"/>
                <circle cx="100" cy="85" r="8" fill="#FFFFFF" opacity="0.5"/>`;
            break;
        case 'box':
            // Gift box
            shapeSVG = `
                <rect x="60" y="70" width="80" height="60" rx="5" fill="${jewelry.color}"/>
                <rect x="65" y="75" width="70" height="20" fill="#FFB6C1"/>
                <rect x="85" y="70" width="10" height="60" fill="#FF69B4"/>
                <polygon points="100,50 90,70 110,70" fill="#FFD700"/>`;
            break;
        case 'small_hoops':
            // Small hoops
            shapeSVG = `
                <circle cx="80" cy="100" r="20" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="120" cy="100" r="20" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="80" cy="100" r="8" fill="#FFFFFF" opacity="0.3"/>
                <circle cx="120" cy="100" r="8" fill="#FFFFFF" opacity="0.3"/>`;
            break;
        case 'cuff':
            // Ear cuff
            shapeSVG = `
                <path d="M 60 120 Q 80 100, 100 100 T 140 120" stroke="${jewelry.color}" stroke-width="12" fill="none"/>
                <circle cx="80" cy="105" r="6" fill="#FFD700"/>
                <circle cx="100" cy="105" r="6" fill="#FFD700"/>
                <circle cx="120" cy="105" r="6" fill="#FFD700"/>`;
            break;
        default:
            // Default circle
            shapeSVG = `<circle cx="100" cy="100" r="60" stroke="${jewelry.color}" stroke-width="15" fill="none"/>`;
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8f9fa"/>
  <g transform="scale(1)">
    ${shapeSVG}
  </g>
  <text x="50%" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#6c757d">${jewelry.name} #${index}</text>
</svg>`;
}