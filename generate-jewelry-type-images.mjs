import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the jewelry types images directory if it doesn't exist
const jewelryTypesDir = path.join(__dirname, 'src', 'assets', 'images', 'jewelry-types');
if (!fs.existsSync(jewelryTypesDir)) {
    fs.mkdirSync(jewelryTypesDir, { recursive: true });
}

// Define jewelry types with specific visual representations
const jewelryTypeImages = [
    // Head & Hair Adornments
    { name: 'Mukuta / Kirita', category: 'head', color: '#D4AF37', description: 'Elaborate crowns symbolizing royalty and divinity' },
    { name: 'Maang Tikka', category: 'head', color: '#B76E79', description: 'Forehead ornament worn at the parting of the hair' },
    { name: 'Diadem', category: 'head', color: '#C0C0C0', description: 'Ornamental headband worn by monarchs' },
    { name: 'Kanzashi', category: 'head', color: '#FF69B4', description: 'Intricate hair ornaments with floral motifs' },
    { name: 'Buyao', category: 'head', color: '#CD7F32', description: 'Dangling hairpins that sway as the wearer walks' },
    { name: 'Ferronnière', category: 'head', color: '#D4AF37', description: 'Delicate headband with a single jewel' },
    
    // Neck & Chest Adornments
    { name: 'Wesekh Collar', category: 'neck', color: '#FFD700', description: 'Broad, layered ceremonial neckpiece' },
    { name: 'Torc', category: 'neck', color: '#C0C0C0', description: 'Large, rigid neck ring' },
    { name: 'Mangalsutra', category: 'neck', color: '#D4AF37', description: 'Sacred wedding necklace' },
    { name: 'Choker', category: 'neck', color: '#8B4513', description: 'Close-fitting necklace' },
    { name: 'Pectoral', category: 'neck', color: '#FFD700', description: 'Large chest ornament' },
    { name: 'Navratna Haar', category: 'neck', color: '#FFD700', description: 'Nine-gemstone necklace' },
    
    // Arms & Hands
    { name: 'Signet Ring', category: 'arms', color: '#8B4513', description: 'Personal seal ring' },
    { name: 'Baju Band', category: 'arms', color: '#D4AF37', description: 'Upper arm coiled armlet' },
    { name: 'Churis / Bangles', category: 'arms', color: '#FFD700', description: 'Rigid bracelets worn in multiples' },
    { name: 'Fede Ring', category: 'arms', color: '#C0C0C0', description: 'Rings with clasped hands' },
    { name: 'Armillae', category: 'arms', color: '#D4AF37', description: 'Military decoration bracelets' },
    { name: 'Thumb Ring', category: 'arms', color: '#CD7F32', description: 'Specifically for archery or status' },
    
    // Waist & Torso
    { name: 'Kamarbandh', category: 'waist', color: '#D4AF37', description: 'Elaborate waist belt or chain' },
    { name: 'Fibula', category: 'waist', color: '#C0C0C0', description: 'Brooch for fastening garments' },
    { name: 'Chatelaine', category: 'waist', color: '#8B4513', description: 'Decorative belt hook with chains' },
    { name: 'Girdle', category: 'waist', color: '#D4AF37', description: 'Waist belt with dangling ends' },
    { name: 'Jade Belt Hooks', category: 'waist', color: '#00A86B', description: 'Intricately carved status symbols' },
    
    // Legs & Feet
    { name: 'Payal / Anklets', category: 'legs', color: '#D4AF37', description: 'Ankle chains with bells' },
    { name: 'Bichiya', category: 'legs', color: '#FFD700', description: 'Toe rings for married women' },
    { name: 'Nupura', category: 'legs', color: '#C0C0C0', description: 'Jeweled bead anklets' },
    { name: 'Slave Anklets', category: 'legs', color: '#8B4513', description: 'Heavier ankle restraints' },
    
    // Symbolic & Functional
    { name: 'Amulet / Talisman', category: 'symbolic', color: '#8B4513', description: 'Protective magical objects' },
    { name: 'Scarab', category: 'symbolic', color: '#2F4F4F', description: 'Beetle-shaped rebirth symbols' },
    { name: 'Khamsa / Hamsa', category: 'symbolic', color: '#4169E1', description: 'Palm-shaped protection symbols' },
    { name: 'Reliquary Pendant', category: 'symbolic', color: '#D4AF37', description: 'Sacred relic holders' },
    { name: 'Scented Pendant', category: 'symbolic', color: '#DA70D6', description: 'Perfume/incense holders' }
];

// Generate SVG content for each jewelry type
jewelryTypeImages.forEach((jewelry) => {
    const svgContent = generateDetailedJewelrySVG(jewelry);
    const fileName = `${sanitizeFileName(jewelry.name)}.svg`;
    const filePath = path.join(jewelryTypesDir, fileName);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Generated ${fileName}`);
});

function sanitizeFileName(name) {
    // Remove special characters and replace spaces with hyphens
    return name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
}

function generateDetailedJewelrySVG(jewelry) {
    let shapeSVG = '';
    
    // Create different SVG representations based on jewelry type
    switch(jewelry.name.toLowerCase().replace(/\s+/g, '').replace(/[\/\-]/g, '')) {
        // Head & Hair Adornments
        case 'mukutakirita':
            shapeSVG = `
                <!-- Crown representation -->
                <path d="M 50 150 L 70 80 L 90 120 L 110 70 L 130 120 L 150 80 L 170 150 Z" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="110" cy="60" r="15" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="110" cy="60" r="8" fill="#FFD700" opacity="0.7"/>
            `;
            break;
        case 'maangtikka':
            shapeSVG = `
                <!-- Maang Tikka - forehead ornament -->
                <circle cx="100" cy="100" r="25" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="100" r="15" fill="#FFB6C1" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="100" r="8" fill="#FF69B4" stroke="#000" stroke-width="1"/>
                <path d="M 100 125 L 100 150" stroke="${jewelry.color}" stroke-width="3"/>
                <circle cx="100" cy="155" r="5" fill="${jewelry.color}"/>
            `;
            break;
        case 'diadem':
            shapeSVG = `
                <!-- Diadem - headband -->
                <rect x="60" y="80" width="80" height="15" rx="5" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="80" cy="75" r="8" fill="#FFD700"/>
                <circle cx="100" cy="70" r="6" fill="#FF69B4"/>
                <circle cx="120" cy="75" r="8" fill="#FFD700"/>
            `;
            break;
        case 'kanzashi':
            shapeSVG = `
                <!-- Kanzashi - hair ornament -->
                <path d="M 80 100 Q 90 80, 100 90 Q 110 80, 120 100" stroke="${jewelry.color}" stroke-width="5" fill="none"/>
                <circle cx="90" cy="85" r="5" fill="#FF69B4"/>
                <circle cx="110" cy="85" r="5" fill="#FFB6C1"/>
                <circle cx="100" cy="95" r="4" fill="#FFD700"/>
            `;
            break;
        case 'buyao':
            shapeSVG = `
                <!-- Buyao - dangling hairpin -->
                <line x1="100" y1="50" x2="100" y2="120" stroke="${jewelry.color}" stroke-width="4"/>
                <circle cx="100" cy="45" r="8" fill="${jewelry.color}"/>
                <circle cx="90" cy="70" r="5" fill="#FF69B4" opacity="0.7"/>
                <circle cx="110" cy="90" r="5" fill="#FFB6C1" opacity="0.7"/>
                <circle cx="95" cy="110" r="4" fill="#FFD700" opacity="0.7"/>
            `;
            break;
        case 'ferronniere':
            shapeSVG = `
                <!-- Ferronnière - headband with jewel -->
                <rect x="60" y="90" width="80" height="8" rx="4" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="80" r="12" fill="#4169E1"/>
                <circle cx="100" cy="80" r="6" fill="#87CEEB" opacity="0.7"/>
            `;
            break;
            
        // Neck & Chest Adornments
        case 'wesekhcollar':
            shapeSVG = `
                <!-- Wesekh Collar - broad neckpiece -->
                <path d="M 50 120 Q 100 80, 150 120 L 150 140 Q 100 100, 50 140 Z" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="70" cy="115" r="6" fill="#FFD700"/>
                <circle cx="90" cy="110" r="5" fill="#FF69B4"/>
                <circle cx="110" cy="108" r="5" fill="#00CED1"/>
                <circle cx="130" cy="115" r="6" fill="#FFD700"/>
            `;
            break;
        case 'torc':
            shapeSVG = `
                <!-- Torc - rigid neck ring -->
                <path d="M 60 100 A 40 40 0 1 1 140 100" stroke="${jewelry.color}" stroke-width="15" fill="none"/>
                <circle cx="60" cy="100" r="10" fill="#FFD700"/>
                <circle cx="140" cy="100" r="10" fill="#FFD700"/>
            `;
            break;
        case 'mangalsutra':
            shapeSVG = `
                <!-- Mangalsutra - sacred necklace -->
                <circle cx="100" cy="100" r="60" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="100" cy="45" r="15" fill="#000" stroke="${jewelry.color}" stroke-width="2"/>
                <circle cx="65" cy="65" r="8" fill="#FF69B4"/>
                <circle cx="135" cy="65" r="8" fill="#FF69B4"/>
                <circle cx="45" cy="100" r="8" fill="#FFD700"/>
                <circle cx="155" cy="100" r="8" fill="#FFD700"/>
                <circle cx="65" cy="135" r="8" fill="#FF69B4"/>
                <circle cx="135" cy="135" r="8" fill="#FF69B4"/>
            `;
            break;
        case 'choker':
            shapeSVG = `
                <!-- Choker - close-fitting necklace -->
                <ellipse cx="100" cy="110" rx="70" ry="15" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="100" r="12" fill="#FF69B4"/>
                <circle cx="100" cy="100" r="6" fill="#FFB6C1" opacity="0.7"/>
            `;
            break;
        case 'pectoral':
            shapeSVG = `
                <!-- Pectoral - chest ornament -->
                <rect x="70" y="70" width="60" height="80" rx="10" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="90" r="8" fill="#FFD700"/>
                <circle cx="85" cy="110" r="6" fill="#00CED1"/>
                <circle cx="115" cy="110" r="6" fill="#00CED1"/>
                <circle cx="100" cy="130" r="7" fill="#FF69B4"/>
            `;
            break;
        case 'navratnahaar':
            shapeSVG = `
                <!-- Navratna Haar - nine-gem necklace -->
                <circle cx="100" cy="100" r="50" stroke="${jewelry.color}" stroke-width="5" fill="none"/>
                <circle cx="100" cy="55" r="8" fill="#F00"/> <!-- Ruby -->
                <circle cx="130" cy="70" r="8" fill="#00F"/> <!-- Sapphire -->
                <circle cx="145" cy="100" r="8" fill="#FF0"/> <!-- Yellow Topaz -->
                <circle cx="130" cy="130" r="8" fill="#000"/> <!-- Cat's Eye -->
                <circle cx="100" cy="145" r="8" fill="#EA0"/> <!-- Pearl -->
                <circle cx="70" cy="130" r="8" fill="#0F0"/> <!-- Emerald -->
                <circle cx="55" cy="100" r="8" fill="#A52A2A"/> <!-- Garnet -->
                <circle cx="70" cy="70" r="8" fill="#800"/> <!-- Coral -->
                <circle cx="100" cy="100" r="6" fill="#FFF"/> <!-- Diamond -->
            `;
            break;
            
        // Arms & Hands
        case 'signetring':
            shapeSVG = `
                <!-- Signet Ring -->
                <circle cx="100" cy="100" r="35" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <rect x="85" y="80" width="30" height="40" rx="5" fill="${jewelry.color}" opacity="0.3"/>
                <circle cx="100" cy="100" r="15" fill="#000" opacity="0.5"/>
            `;
            break;
        case 'bajuband':
            shapeSVG = `
                <!-- Baju Band - armlet -->
                <path d="M 60 100 A 40 20 0 1 1 140 100 A 40 20 0 1 1 60 100" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="80" cy="95" r="6" fill="#FFD700"/>
                <circle cx="120" cy="95" r="6" fill="#FFD700"/>
                <path d="M 100 85 Q 105 90, 100 95 Q 95 90, 100 85" fill="#FF69B4"/>
            `;
            break;
        case 'churisbangles':
            shapeSVG = `
                <!-- Bangles -->
                <circle cx="80" cy="100" r="25" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="120" cy="100" r="25" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="80" cy="100" r="15" stroke="#FFD700" stroke-width="3" fill="none"/>
                <circle cx="120" cy="100" r="15" stroke="#FFD700" stroke-width="3" fill="none"/>
            `;
            break;
        case 'federing':
            shapeSVG = `
                <!-- Fede Ring - clasped hands -->
                <path d="M 70 110 Q 80 90, 90 100 Q 100 110, 110 100 Q 120 90, 130 110" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="100" cy="95" r="8" fill="#FF69B4"/>
            `;
            break;
        case 'armillae':
            shapeSVG = `
                <!-- Armillae - military bracelets -->
                <circle cx="100" cy="100" r="30" stroke="${jewelry.color}" stroke-width="10" fill="none"/>
                <circle cx="75" cy="85" r="5" fill="#FFD700"/>
                <circle cx="125" cy="85" r="5" fill="#FFD700"/>
                <circle cx="100" cy="125" r="5" fill="#FFD700"/>
            `;
            break;
        case 'thumbring':
            shapeSVG = `
                <!-- Thumb Ring -->
                <circle cx="100" cy="100" r="25" stroke="${jewelry.color}" stroke-width="12" fill="none"/>
                <circle cx="100" cy="100" r="15" stroke="#C0C0C0" stroke-width="4" fill="none"/>
                <circle cx="100" cy="85" r="8" fill="#4169E1"/>
            `;
            break;
            
        // Waist & Torso
        case 'kamarbandh':
            shapeSVG = `
                <!-- Kamarbandh - waist belt -->
                <rect x="50" y="95" width="100" height="15" rx="5" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="70" cy="102" r="6" fill="#FFD700"/>
                <circle cx="100" cy="85" r="10" fill="#FF69B4"/>
                <circle cx="130" cy="102" r="6" fill="#FFD700"/>
            `;
            break;
        case 'fibula':
            shapeSVG = `
                <!-- Fibula - garment brooch -->
                <path d="M 70 100 Q 100 70, 130 100" stroke="${jewelry.color}" stroke-width="10" fill="none"/>
                <circle cx="100" cy="85" r="12" fill="${jewelry.color}"/>
                <circle cx="100" cy="85" r="6" fill="#FFD700"/>
            `;
            break;
        case 'chatelaine':
            shapeSVG = `
                <!-- Chatelaine - belt hook with chains -->
                <rect x="85" y="80" width="30" height="15" rx="5" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <line x1="100" y1="95" x2="100" y2="130" stroke="${jewelry.color}" stroke-width="2"/>
                <circle cx="90" cy="110" r="5" fill="#FF69B4"/>
                <rect x="95" y="120" width="10" height="8" fill="#00CED1"/>
                <circle cx="110" cy="125" r="4" fill="#FFD700"/>
            `;
            break;
        case 'girdle':
            shapeSVG = `
                <!-- Girdle - waist belt -->
                <rect x="60" y="95" width="80" height="10" rx="3" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <path d="M 100 105 L 100 140" stroke="${jewelry.color}" stroke-width="3"/>
                <circle cx="100" cy="145" r="6" fill="#FF69B4"/>
                <circle cx="90" cy="130" r="4" fill="#FFD700"/>
                <circle cx="110" cy="120" r="4" fill="#00CED1"/>
            `;
            break;
        case 'jadebelthooks':
            shapeSVG = `
                <!-- Jade Belt Hooks -->
                <path d="M 80 90 Q 100 70, 120 90 L 120 110 Q 100 130, 80 110 Z" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <rect x="95" y="95" width="10" height="20" fill="#00A86B"/>
                <circle cx="100" cy="85" r="5" fill="#FFD700"/>
            `;
            break;
            
        // Legs & Feet
        case 'payalanklets':
            shapeSVG = `
                <!-- Payal / Anklets -->
                <circle cx="100" cy="100" r="35" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="70" cy="100" r="5" fill="${jewelry.color}"/>
                <circle cx="85" cy="75" r="5" fill="${jewelry.color}"/>
                <circle cx="115" cy="75" r="5" fill="${jewelry.color}"/>
                <circle cx="130" cy="100" r="5" fill="${jewelry.color}"/>
                <circle cx="115" cy="125" r="5" fill="${jewelry.color}"/>
                <circle cx="85" cy="125" r="5" fill="${jewelry.color}"/>
                <!-- Bells -->
                <circle cx="70" cy="100" r="8" fill="#FFD700" opacity="0.5"/>
                <circle cx="130" cy="100" r="8" fill="#FFD700" opacity="0.5"/>
            `;
            break;
        case 'bichiya':
            shapeSVG = `
                <!-- Bichiya - toe rings -->
                <circle cx="80" cy="110" r="10" stroke="#FFD700" stroke-width="6" fill="none"/>
                <circle cx="100" cy="110" r="10" stroke="#FFD700" stroke-width="6" fill="none"/>
                <circle cx="120" cy="110" r="10" stroke="#FFD700" stroke-width="6" fill="none"/>
                <circle cx="140" cy="110" r="10" stroke="#FFD700" stroke-width="6" fill="none"/>
            `;
            break;
        case 'nupura':
            shapeSVG = `
                <!-- Nupura - jeweled anklets -->
                <circle cx="100" cy="100" r="30" stroke="${jewelry.color}" stroke-width="10" fill="none"/>
                <circle cx="75" cy="90" r="5" fill="#FF69B4"/>
                <circle cx="85" cy="75" r="5" fill="#00CED1"/>
                <circle cx="115" cy="75" r="5" fill="#00CED1"/>
                <circle cx="125" cy="90" r="5" fill="#FF69B4"/>
                <circle cx="125" cy="110" r="5" fill="#FFD700"/>
                <circle cx="75" cy="110" r="5" fill="#FFD700"/>
                <circle cx="100" cy="125" r="5" fill="#FFB6C1"/>
            `;
            break;
        case 'slaveanklets':
            shapeSVG = `
                <!-- Slave Anklets - heavier restraints -->
                <circle cx="100" cy="100" r="35" stroke="${jewelry.color}" stroke-width="15" fill="none"/>
                <rect x="85" y="95" width="30" height="10" fill="${jewelry.color}"/>
                <line x1="70" y1="100" x2="60" y2="120" stroke="${jewelry.color}" stroke-width="4"/>
                <circle cx="60" cy="120" r="5" fill="#FF69B4"/>
            `;
            break;
            
        // Symbolic & Functional
        case 'amulettalisman':
            shapeSVG = `
                <!-- Amulet/Talisman -->
                <path d="M 80 80 Q 100 60, 120 80 L 120 120 Q 100 140, 80 120 Z" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="100" r="15" fill="#000" opacity="0.3"/>
                <circle cx="90" cy="90" r="4" fill="#FFD700"/>
                <circle cx="110" cy="90" r="4" fill="#FFD700"/>
                <circle cx="100" cy="110" r="4" fill="#FFD700"/>
            `;
            break;
        case 'scarab':
            shapeSVG = `
                <!-- Scarab - beetle amulet -->
                <ellipse cx="100" cy="100" rx="25" ry="15" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <ellipse cx="100" cy="95" rx="15" ry="10" fill="#2F4F4F"/>
                <circle cx="90" cy="95" r="3" fill="#000"/>
                <circle cx="110" cy="95" r="3" fill="#000"/>
                <path d="M 85 105 L 95 110 M 105 110 L 115 105" stroke="#000" stroke-width="2"/>
            `;
            break;
        case 'khamsahamsa':
            shapeSVG = `
                <!-- Khamsa/Hamsa - hand symbol -->
                <path d="M 100 70 Q 70 90, 80 130 L 85 125 Q 85 100, 100 90 Q 115 100, 115 125 L 120 130 Q 130 90, 100 70" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="95" r="10" fill="#4169E1"/>
                <circle cx="100" cy="95" r="5" fill="#87CEEB" opacity="0.7"/>
            `;
            break;
        case 'reliquarypendant':
            shapeSVG = `
                <!-- Reliquary Pendant -->
                <path d="M 100 60 L 80 90 L 85 130 L 115 130 L 120 90 Z" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <rect x="90" y="95" width="20" height="15" fill="#FFF" opacity="0.7"/>
                <circle cx="100" cy="75" r="8" fill="#FFD700"/>
            `;
            break;
        case 'scentedpendant':
            shapeSVG = `
                <!-- Scented Pendant -->
                <circle cx="100" cy="100" r="25" fill="${jewelry.color}" stroke="#000" stroke-width="1"/>
                <circle cx="100" cy="100" r="15" fill="#DA70D6" opacity="0.5"/>
                <path d="M 90 90 Q 95 85, 100 90 Q 105 85, 110 90" stroke="#FFF" stroke-width="2" fill="none"/>
                <path d="M 90 100 Q 95 95, 100 100 Q 105 95, 110 100" stroke="#FFF" stroke-width="2" fill="none"/>
                <path d="M 90 110 Q 95 105, 100 110 Q 105 105, 110 110" stroke="#FFF" stroke-width="2" fill="none"/>
            `;
            break;
            
        default:
            // Default circular representation
            shapeSVG = `
                <circle cx="100" cy="100" r="40" stroke="${jewelry.color}" stroke-width="8" fill="none"/>
                <circle cx="100" cy="100" r="25" stroke="${jewelry.color}" stroke-width="4" fill="none"/>
                <circle cx="100" cy="80" r="8" fill="${jewelry.color}"/>
            `;
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8f9fa"/>
  <g transform="scale(1)">
    ${shapeSVG}
  </g>
  <text x="50%" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="#6c757d">${jewelry.name}</text>
  <text x="50%" y="192" text-anchor="middle" font-family="Arial" font-size="8" fill="#6c757d">${jewelry.description}</text>
</svg>`;
}