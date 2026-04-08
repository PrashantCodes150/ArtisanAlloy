import { Shield, Heart, Sparkles, Anchor, Compass } from 'lucide-react';

// Import the new jewelry type images
import MukutaKirita from '../assets/images/encyclopedia/mukuta-kirita.png';
import MaangTikka from '../assets/images/encyclopedia/maang-tikka.png';
import Diadem from '../assets/images/encyclopedia/diadem.png';
import Kanzashi from '../assets/images/encyclopedia/kanzashi.png';
import Buyao from '../assets/images/encyclopedia/buyao.png';
import Ferronniere from '../assets/images/encyclopedia/ferronniere.png';
import WesekhCollar from '../assets/images/jewelry-types/wesekh-collar.svg';
import Torc from '../assets/images/jewelry-types/torc.svg';
import Mangalsutra from '../assets/images/jewelry-types/mangalsutra.svg';
import Choker from '../assets/images/jewelry-types/choker.svg';
import Pectoral from '../assets/images/jewelry-types/pectoral.svg';
import NavratnaHaar from '../assets/images/jewelry-types/navratna-haar.svg';
import SignetRing from '../assets/images/jewelry-types/signet-ring.svg';
import BajuBand from '../assets/images/jewelry-types/baju-band.svg';
import ChurisBangles from '../assets/images/jewelry-types/churis-bangles.svg';
import FedeRing from '../assets/images/jewelry-types/fede-ring.svg';
import Armillae from '../assets/images/jewelry-types/armillae.svg';
import ThumbRing from '../assets/images/jewelry-types/thumb-ring.svg';
import Kamarbandh from '../assets/images/jewelry-types/kamarbandh.svg';
import Fibula from '../assets/images/jewelry-types/fibula.svg';
import Chatelaine from '../assets/images/jewelry-types/chatelaine.svg';
import Girdle from '../assets/images/jewelry-types/girdle.svg';
import JadeBeltHooks from '../assets/images/jewelry-types/jade-belt-hooks.svg';
import PayalAnklets from '../assets/images/jewelry-types/payal-anklets.svg';
import Bichiya from '../assets/images/jewelry-types/bichiya.svg';
import Nupura from '../assets/images/jewelry-types/nupura.svg';
import SlaveAnklets from '../assets/images/jewelry-types/slave-anklets.svg';
import AmuletTalisman from '../assets/images/jewelry-types/amulet-talisman.svg';
import Scarab from '../assets/images/jewelry-types/scarab.svg';
import KhamsaHamsa from '../assets/images/jewelry-types/khamsa-hamsa.svg';
import ReliquaryPendant from '../assets/images/jewelry-types/reliquary-pendant.svg';
import ScentedPendant from '../assets/images/jewelry-types/scented-pendant.svg';

export const jewelryTypesData = [
    {
        id: 'head',
        name: 'Head & Hair Adornments',
        icon: Sparkles,
        description: 'Symbols of status, divinity, and marital identity worn on the head and forehead.',
        types: [
            {
                name: 'Mukuta / Kirita',
                origin: 'Ancient India',
                description: 'Elaborate crowns symbolizing royalty and divinity.',
                image: MukutaKirita,
                source: 'Custom Generated Image',
            },
            {
                name: 'Maang Tikka',
                origin: 'South Asia',
                description: 'Forehead ornament worn at the parting of the hair, symbolizing the third eye.',
                image: MaangTikka,
                source: 'Custom Generated Image',
            },
            {
                name: 'Diadem',
                origin: 'Ancient Greece/Rome',
                description: 'A type of crown, specifically an ornamental headband worn by monarchs.',
                image: Diadem,
                source: 'Custom Generated Image',
            },
            {
                name: 'Kanzashi',
                origin: 'Japan',
                description: 'Intricate hair ornaments often featuring seasonal floral motifs.',
                image: Kanzashi,
                source: 'Custom Generated Image',
            },
            {
                name: 'Buyao',
                origin: 'Ancient China',
                description: '"Step-shake" hairpins that dangle and sway as the wearer walks.',
                image: Buyao,
                source: 'Custom Generated Image',
            },
            {
                name: 'Ferronnière',
                origin: 'Renaissance Europe',
                description: 'A delicate headband with a single small jewel worn on the forehead.',
                image: Ferronniere,
                source: 'Custom Generated Image',
            }
        ]
    },
    {
        id: 'neck',
        name: 'Neck & Chest Adornments',
        icon: Anchor,
        description: 'From ceremonial collars to protective amulets, these pieces frame the face and heart.',
        types: [
            {
                name: 'Wesekh Collar',
                origin: 'Ancient Egypt',
                description: 'Broad, layered ceremonial neckpiece made of gold and semi-precious stones.',
                image: WesekhCollar,
                source: 'Custom Generated Image',
            },
            {
                name: 'Torc',
                origin: 'Celtic / Iron Age',
                description: 'A large, rigid neck ring, often made of twisted gold or bronze.',
                image: Torc,
                source: 'Custom Generated Image',
            },
            {
                name: 'Mangalsutra',
                origin: 'India',
                description: 'Sacred wedding necklace symbolizing the union and protection of the husband.',
                image: Mangalsutra,
                source: 'Custom Generated Image',
            },
            {
                name: 'Choker',
                origin: 'Global / Victorian',
                description: 'A close-fitting necklace, popularized in various eras for elegance.',
                image: Choker,
                source: 'Custom Generated Image',
            },
            {
                name: 'Pectoral',
                origin: 'Mesoamerica / Egypt',
                description: 'Large, elaborate ornaments worn on the chest, often for ritual purposes.',
                image: Pectoral,
                source: 'Custom Generated Image',
            },
            {
                name: 'Navratna Haar',
                origin: 'Ancient India',
                description: 'Necklace featuring nine specific gemstones representing the nine planets.',
                image: NavratnaHaar,
                source: 'Custom Generated Image',
            }
        ]
    },
    {
        id: 'arms',
        name: 'Arms & Hands',
        icon: Sparkles,
        description: 'Adornments for the wrists, fingers, and upper arms, often serving as seals or status markers.',
        types: [
            {
                name: 'Signet Ring',
                origin: 'Ancient Rome / Mesopotamia',
                description: 'Used as a personal seal to authenticate documents and signify authority.',
                image: SignetRing,
                source: 'Custom Generated Image',
            },
            {
                name: 'Baju Band',
                origin: 'Ancient India',
                description: 'Coiled or flat armlets worn on the upper arm, often featuring snake motifs.',
                image: BajuBand,
                source: 'Custom Generated Image',
            },
            {
                name: 'Churis / Bangles',
                origin: 'South Asia',
                description: 'Rigid bracelets made of gold, glass, or shell, often worn in multiples.',
                image: ChurisBangles,
                source: 'Custom Generated Image',
            },
            {
                name: 'Fede Ring',
                origin: 'Medieval Europe',
                description: 'Rings featuring two clasped hands, symbolizing love and fidelity.',
                image: FedeRing,
                source: 'Custom Generated Image',
            },
            {
                name: 'Armillae',
                origin: 'Ancient Rome',
                description: 'Bracelets awarded to soldiers as military decorations for bravery.',
                image: Armillae,
                source: 'Custom Generated Image',
            },
            {
                name: 'Thumb Ring',
                origin: 'Ottoman / Mughal',
                description: 'Worn specifically for archery or as a symbol of high rank.',
                image: ThumbRing,
                source: 'Custom Generated Image',
            }
        ]
    },
    {
        id: 'waist',
        name: 'Waist & Torso',
        icon: Compass,
        description: 'Functional and decorative pieces worn around the waist or attached to clothing.',
        types: [
            {
                name: 'Kamarbandh',
                origin: 'India',
                description: 'Elaborate waist belts or chains, often used to secure garments.',
                image: Kamarbandh,
                source: 'Custom Generated Image',
            },
            {
                name: 'Fibula',
                origin: 'Ancient Rome / Greece',
                description: 'A brooch or pin used for fastening garments, often highly decorative.',
                image: Fibula,
                source: 'Custom Generated Image',
            },
            {
                name: 'Chatelaine',
                origin: '18th Century Europe',
                description: 'A decorative belt hook or clasp with chains holding functional tools.',
                image: Chatelaine,
                source: 'Custom Generated Image',
            },
            {
                name: 'Girdle',
                origin: 'Medieval Europe',
                description: 'A belt worn around the waist, often featuring long dangling ends.',
                image: Girdle,
                source: 'Custom Generated Image',
            },
            {
                name: 'Jade Belt Hooks',
                origin: 'Ancient China',
                description: 'Intricately carved hooks used to fasten belts, symbolizing status.',
                image: JadeBeltHooks,
                source: 'Custom Generated Image',
            }
        ]
    },
    {
        id: 'legs',
        name: 'Legs & Feet',
        icon: Heart,
        description: 'Delicate and rhythmic adornments for the ankles and toes.',
        types: [
            {
                name: 'Payal / Anklets',
                origin: 'South Asia',
                description: 'Ankle chains, often with small bells (ghungroos) that create sound.',
                image: PayalAnklets,
                source: 'Custom Generated Image',
            },
            {
                name: 'Bichiya',
                origin: 'India',
                description: 'Toe rings worn by married women, specifically on the second toe.',
                image: Bichiya,
                source: 'Custom Generated Image',
            },
            {
                name: 'Nupura',
                origin: 'Ancient India',
                description: 'Jeweled bead anklets mentioned in ancient Sanskrit literature.',
                image: Nupura,
                source: 'Custom Generated Image',
            },
            {
                name: 'Slave Anklets',
                origin: 'Ancient Middle East',
                description: 'Heavier anklets, sometimes connected to toe rings by chains.',
                image: SlaveAnklets,
                source: 'Custom Generated Image',
            }
        ]
    },
    {
        id: 'symbolic',
        name: 'Symbolic & Functional',
        icon: Shield,
        description: 'Jewelry designed for protection, spiritual connection, or practical use.',
        types: [
            {
                name: 'Amulet / Talisman',
                origin: 'Global',
                description: 'Objects believed to possess magical powers or provide protection.',
                image: AmuletTalisman,
                source: 'Custom Generated Image',
            },
            {
                name: 'Scarab',
                origin: 'Ancient Egypt',
                description: 'Beetle-shaped amulets symbolizing rebirth and eternal life.',
                image: Scarab,
                source: 'Custom Generated Image',
            },
            {
                name: 'Khamsa / Hamsa',
                origin: 'Middle East / North Africa',
                description: 'Palm-shaped amulet used for protection against the evil eye.',
                image: KhamsaHamsa,
                source: 'Custom Generated Image',

            },
            {
                name: 'Reliquary Pendant',
                origin: 'Medieval Europe',
                description: 'Pendants designed to hold sacred relics or religious items.',
                image: ReliquaryPendant,
                source: 'Custom Generated Image',
            },
            {
                name: 'Scented Pendant',
                origin: 'Renaissance Europe',
                description: 'Jewelry designed to hold incense or perfume to combat odors.',
                image: ScentedPendant,
                source: 'Custom Generated Image',
            }
        ]
    }
];
