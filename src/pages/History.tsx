import { Clock, MapPin, ExternalLink } from 'lucide-react';
import historyBg from '../assets/backgrounds/history_bg.png';
import indusImg from '../assets/images/indus-valley.png';
import egyptImg from '../assets/images/egypt.png';
import mesopotamiaImg from '../assets/images/mesopotamia.png';
import greeceImg from '../assets/images/greece.png';
import chinaImg from '../assets/images/china.png';
import africaImg from '../assets/images/africa.png';
import romeImg from '../assets/images/rome.png';
import medievalImg from '../assets/images/medieval.png';
import modernImg from '../assets/images/modern.png';

const History = () => {
    const civilizations = [
        {
            era: 'Ancient India - Indus Valley',
            period: '3300-1300 BCE',
            location: 'South Asia (Modern Pakistan & India)',
            title: 'The Cradle of Jewelry Making',
            description: `The Indus Valley Civilization holds the distinction of having the longest history of jewelry making globally, dating back 5,000 years. Archaeological  excavations at Mohenjo-Daro, Harappa, and Lothal have revealed extraordinary craftsmanship, including carnelian bead necklaces, gold ornaments, and turquoise jewelry. A remarkable 5,000-year-old necklace with steatite and gold beads was excavated from Mohenjo-Daro. The civilization pioneered advanced techniques like bead drilling, lost-wax casting, and the diamond drill. Materials included gold, silver, copper, ivory, lapis lazuli (imported from Afghanistan), carnelian, agate, jasper, and faience. The famous bronze "Dancing Girl" statue depicts a woman wearing stacked bangles, showcasing the fashion consciousness of the era.`,
            discoveries: 'Excavations at Rakhigarhi uncovered a 5,000-year-old jewelry-making factory. A significant 10kg gold jewelry cache from 2000 BCE was found in Mandi, Uttar Pradesh.',
            image: indusImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Indus_Valley_Civilisation#Arts_and_crafts'
        },
        {
            era: 'Ancient Egypt',
            period: '3000 BCE - 30 BCE',
            location: 'North Africa (Nile Valley)',
            title: 'Divine Symbols of Eternal Life',
            description: `Ancient Egyptian jewelry was among the most sophisticated and symbolic in the ancient world. Pharaohs and nobility wore elaborate pieces made from gold, lapis lazuli, turquoise, carnelian, and faience. The tomb of Tutankhamun (discovered 1922) contained over 104 individual pieces of jewelry on his mummy alone, including pectorals with winged scarab beetles, broad collars, and gold rings. These pieces incorporated religious symbols like the Eye of Horus and served both decorative and protective purposes for the afterlife. Queen Hetepheres I's tomb revealed rare silver bracelets inlaid with turquoise and lapis lazuli in butterfly designs - particularly significant as silver was rarer than gold in Egypt, indicating extensive trade networks.`,
            discoveries: 'Howard Carter\'s 1922 discovery of Tutankhamun\'s intact tomb revealed unprecedented jewelry treasures. A 3,800-year-old Middle Kingdom tomb near Luxor (2024) yielded exquisite jewelry with amethyst, carnelian, and garnet.',
            image: egyptImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Egyptian_flint_jewelry'
        },
        {
            era: 'Ancient Mesopotamia (Sumer & Babylon)',
            period: '2750-539 BCE',
            location: 'Middle East (Modern Iraq)',
            title: 'Pioneers of Goldsmithing Techniques',
            description: `Mesopotamian civilizations revolutionized jewelry craftsmanship, with the Sumerians (c. 2750 BCE) pioneering granulation and filigree techniques still used today. The Royal Cemetery of Ur yielded spectacular discoveries, including Queen Pu-Abi's elaborate headdress made of gold leaves, lapis lazuli, and carnelian beads. Unlike many ancient societies, Mesopotamian jewelry was worn by all social classes, though materials varied by wealth. Lapis lazuli, imported from Afghanistan, was often valued more than gold. Popular items included cylinder seals (used as personal signatures), ankle bracelets, silver hair rings, and gold earrings. Decorative motifs featured natural elements like leaves, grapes, and spirals.`,
            discoveries: 'The Royal Cemetery of Ur (excavated 1922-1934) revealed over 2,000 graves with extraordinary jewelry, providing insights into Sumerian burial practices and social hierarchy.',
            image: mesopotamiaImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Mesopotamia#Arts_and_crafts'
        },
        {
            era: 'Ancient Greece',
            period: '1200-31 BCE',
            location: 'Mediterranean (Greece & Aegean)',
            title: 'Artistry Inspired by Gods',
            description: `Greek jewelry evolved from Eastern influences to develop a distinctive style emphasizing natural beauty and mythological themes. Artisans crafted intricate pieces featuring floral and plant motifs, often depicting gods like Athena and Aphrodite. The Greeks mastered filigree and granulation techniques, creating delicate gold work with remarkable detail. Popular pieces included laurel wreath crowns, elaborate necklaces with dangling miniature vases, earrings, bracelets, and rings. They primarily used gold and silver, later incorporating colored enamels and gemstones. Greek women wore jewelry not just for adornment but also as offerings to deities and for protection, believing certain pieces carried divine blessings.`,
            discoveries: 'Numerous Hellenistic-period tombs in Greece and Asia Minor have yielded extraordinary gold jewelry, showcasing the civilization\'s artistic peak between 323-31 BCE.',
            image: greeceImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Greek_art#Jewellery'
        },
        {
            era: 'Ancient China',
            period: 'Neoith period - Han Dynasty (6500 BCE - 220 CE)',
            title: 'Jade: The Stone of Heaven',
            description: `In ancient China, jade was valued more highly than gold or jewels, symbolizing purity, nobility, and immortality. The Hongshan culture (4700-2200 BCE) created jade "pig-dragons" and ceremonial objects. The Liangzhu culture produced sophisticated ritual pieces like the bi (flat disk symbolizing heaven) and cong (prismatic tube representing earth). During the Han Dynasty, jade reached its peak importance with the creation of full burial suits made from thousands of jade pieces sewn together with gold thread, as discovered in Prince Liu Sheng's tomb (113 BCE). The Zhou Dynasty systematized jade's use, associating its qualities with the virtues of a gentleman-scholar. Archaeological sites at Sanxingdui revealed 3,400-year-old jade workshops, showing sophisticated production chains.`,
            discoveries: 'The 1968 discovery of Prince Liu Sheng\'s jade burial suit (made of 2,498 jade pieces with gold thread) revolutionized understanding of Han Dynasty burial customs. Recent Inner Mongolia finds uncovered the largest jade dragon ever discovered (15.8 cm).',
            image: chinaImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Chinese_jade'
        },
        {
            era: 'Ancient Rome',
            period: '27 BCE - 476 CE',
            location: 'Mediterranean & Europe',
            title: 'Colored Gems of Imperial Power',
            description: `Roman jewelry distinguished itself through extensive use of colored gemstones and glass, contrasting with Greek emphasis on metalwork. Romans valued rubies, emeralds, pearls, diamonds, sapphires, garnets, and jet. Jewelry served as powerful symbols of wealth, status, and power across all social classes. The vast Roman Empire's trade networks, including the Silk Road, brought precious stones from the East. Popular items included fibulae (brooches) with garnets, gem-set rings (with strict social regulations on who could wear gold rings), necklaces, and amulets. Roman children wore protective jewelry like bullae (circular pendants) and phallic fascinus symbols to ward off illness. Techniques like filigree and granulation, inherited from the Etruscans and Greeks, continued to flourish.`,
            discoveries: 'Numerous Roman-era hoards have been discovered across the former empire, including the Hoxne Hoard in England with gold jewelry and gemstone rings. Pompeii\'s destruction preserved jewelry in situ, offering unique insights into daily Roman life.',
            image: romeImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Ancient_Roman_jewelry'
        },
        {
            era: 'Traditional Africa',
            period: '75,000 BCE - Present',
            location: 'African Continent',
            title: 'The World\'s First Jewelry',
            description: `Africa holds the earliest evidence of human jewelry - 75,000-year-old mollusc shell beads found in South Africa's Blombos Cave, likely used as necklaces or bracelets. African jewelry serves as a profound visual language, conveying status, tribal affiliation, age, marital status, and spiritual beliefs. The Maasai, Zulu, and Samburu tribes developed elaborate beaded traditions with specific color combinations carrying distinct meanings. Gold jewelry in kingdoms like ancient Ghana symbolized divine power and royal authority. Materials included cowrie shells (used as currency and fertility symbols), bone from sacred animals (believed to hold spiritual power), brass coils, animal teeth, seeds, and ostrich shells. The Yoruba civilization (13th century) pioneered the lost-wax bronze casting method. African jewelry continues to blend traditional techniques with contemporary design.`,
            discoveries: 'The Blombos Cave discoveries fundamentally changed our understanding of early human cognitive development and symbolic behavior. Ancient Ghana\'s gold mines provided wealth that supported elaborate royal jewelry traditions.',
            image: africaImg,
            wikipedia: 'https://en.wikipedia.org/wiki/African_art#Personal_adornment'
        },
        {
            era: 'Medieval Europe',
            period: '500-1500 CE',
            location: 'European Continent',
            title: 'Faith, Royalty, and Gothic Splendor',
            description: `Medieval European jewelry reflected the era's deep Christian faith and feudal social structure. Religious iconography dominated, with crosses, reliquaries, and pieces featuring saints and biblical scenes. Royal crowns incorporated rubies, sapphires, emeralds, and pearls, often commissioned for coronations and stored in cathedral treasuries. The Gothic period (12th-16th centuries) saw increasingly elaborate designs with pointed arches and intricate enamel work. Rings served as symbols of power, betrothal, and religious devotion. The Byzantine Empire's influence brought cloisonné enamel techniques and rich coloration. Unlike earlier periods, medieval jewelry often included inscriptions and motto phrases. Brooches and fibulae served practical purposes for fastening clothing while displaying wealth and allegiance.`,
            discoveries: 'Cathedral treasuries across Europe preserve medieval jewelry, including imperial crowns, episcopal rings, and reliquary pendants. The Crown Jewels of various European monarchies contain pieces dating to medieval times.',
            image: medievalImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Medieval_art#Metalwork_and_ivory'
        },
        {
            era: 'Modern & Contemporary',
            period: '1500 CE - Present',
            location: 'Global',
            title: 'From Renaissance Splendor to Sustainable Luxury',
            description: `Modern jewelry history spans five revolutionary eras. The Renaissance (1500-1650) brought naturalistic designs, elaborate enameling, and the rise of gemstone cutting, with pieces featuring mythological themes and portraits. The Georgian and Victorian eras (1714-1901) saw sentimental jewelry flourish - lockets, mourning jewelry, and the introduction of the engagement ring tradition by Queen Victoria. The Art Nouveau movement (1890-1910) rejected mass production, embracing organic forms, enamel work, and semi-precious stones over diamonds. Art Deco (1920-1939) revolutionized design with geometric patterns, platinum settings, and bold color contrasts. Contemporary jewelry (1950-present) embraces diverse styles from minimalism to maximalism, incorporating new materials like titanium and silicon, while the 21st century has ushered in the ethical jewelry movement prioritizing conflict-free diamonds, recycled metals, and fair-trade gemstones. Technology now enables 3D-printed designs and lab-grown diamonds, merging ancient craftsmanship with cutting-edge innovation.`,
            discoveries: 'Major auction houses regularly discover and sell historic pieces from Cartier, Tiffany & Co., and Bulgari. The modern era has seen the rise of designer jewelry as collectible art, with pieces by Lalique, Fabergé, and contemporary designers fetching millions at auction.',
            image: modernImg,
            wikipedia: 'https://en.wikipedia.org/wiki/Jewellery#Modern'
        }
    ];

    return (
        <div className="pt-24 bg-jewelry-dark">
            {/* Hero Section */}
            <section className="relative py-28 px-4 text-center bg-gradient-to-b from-jewelry-dark-deep to-jewelry-dark overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.08]">
                    <img
                        src={historyBg}
                        alt=""
                        className="w-full h-full object-cover sepia-[0.3] contrast-125"
                    />
                </div>
                <Clock className="w-16 h-16 text-jewelry-gold mx-auto mb-6 animate-pulse" />
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4 pb-3">
                    Global History of Jewellery
                </h1>
                <p className="font-sans text-jewelry-cream/80 text-lg max-w-3xl mx-auto leading-relaxed mb-4">
                    A comprehensive journey through 75,000 years of human adornment, from the first shell beads in Africa to the elaborate imperial treasures of ancient civilizations
                </p>
                <p className="font-sans text-jewelry-cream/60 text-sm italic">
                    Research compiled from archaeological discoveries and historical records
                </p>
            </section>

            {/* Introduction */}
            <section className="py-16 px-4 bg-jewelry-dark">
                <div className="max-w-5xl mx-auto">
                    <div className="glass rounded-2xl p-8 md:p-12">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-jewelry-gold mb-6">
                            The Enduring Legacy of Human Adornment
                        </h2>
                        <div className="space-y-4 font-sans text-jewelry-cream/80 leading-relaxed">
                            <p>
                                Jewelry has been an integral part of human culture for over <strong className="text-jewelry-gold">75,000 years</strong>,
                                making it one of humanity's oldest art forms. From simple shells to elaborate gold creations, jewelry has served as
                                symbols of status, love, faith, power, and identity across every civilization.
                            </p>
                            <p>
                                Archaeological excavations have unearthed extraordinary treasures from burial sites, royal tombs, and ancient cities,
                                revealing sophisticated craftsmanship that rivals modern techniques. These discoveries show that our ancestors possessed
                                remarkable artistic vision and technical skill, creating pieces that continue to inspire wonder today.
                            </p>
                            <p>
                                This comprehensive history explores jewelry traditions from Ancient India (Indus Valley), Egypt, Mesopotamia, Greece,
                                Rome, China, Africa, Medieval Europe, and beyond - showcasing how jewelry has shaped and reflected human civilization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Civilizations Timeline */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-20">
                    {civilizations.map((civ, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
                        >
                            {/* Image */}
                            <div className="lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden glass group video-like-image">
                                    <img
                                        src={civ.image}
                                        alt={civ.era}
                                        className={`w-full h-96 object-cover transition-transform duration-500 ${index % 3 === 0 ? 'ken-burns-effect' :
                                            index % 3 === 1 ? 'slow-pan' :
                                                'subtle-zoom'
                                            }`}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold text-sm flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {civ.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-1/2 space-y-4">
                                <div className="inline-block px-4 py-2 rounded-full glass-light">
                                    <span className="text-jewelry-rose font-sans font-semibold text-sm">{civ.period}</span>
                                </div>

                                <h3 className="font-display text-3xl md:text-4xl text-jewelry-gold">{civ.era}</h3>
                                <h4 className="font-display text-2xl text-jewelry-cream/90">{civ.title}</h4>

                                <div className="glass rounded-xl p-6 space-y-4">
                                    <p className="font-sans text-jewelry-cream/80 leading-relaxed text-justify">
                                        {civ.description}
                                    </p>

                                    {civ.discoveries && (
                                        <div className="pt-4 border-t border-jewelry-gold/20">
                                            <h5 className="font-sans font-semibold text-jewelry-gold mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-jewelry-gold"></span>
                                                Archaeological Discoveries
                                            </h5>
                                            <p className="font-sans text-jewelry-cream/70 text-sm leading-relaxed">
                                                {civ.discoveries}
                                            </p>
                                        </div>
                                    )}

                                    <a
                                        href={civ.wikipedia}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-jewelry-gold hover:text-jewelry-gold-light transition-colors text-sm font-sans mt-4"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Learn more on Wikipedia
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Impact on Human History */}
            <section className="py-20 px-4 bg-gradient-to-r from-jewelry-dark to-jewelry-dark-deep">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-6">
                            How Jewelry Shaped Human History
                        </h2>
                        <p className="font-sans text-jewelry-cream/70 max-w-3xl mx-auto">
                            Beyond beauty, jewelry has profoundly influenced human civilization
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: 'Economic Impact',
                                description: 'Jewelry served as currency, stored wealth, facilitated trade routes (like the Silk Road), and drove exploration for precious materials.'
                            },
                            {
                                title: 'Social Structure',
                                description: 'Pieces indicated rank, profession, tribal affiliation, and marital status, creating visual hierarchies in societies worldwide.'
                            },
                            {
                                title: 'Religious Significance',
                                description: 'Amulets, talismans, and sacred jewelry connected wearers to gods, protected souls in the afterlife, and marked religious devotion.'
                            },
                            {
                                title: 'Artistic Innovation',
                                description: 'Jewelry pushed boundaries in metallurgy, gemstone cutting, enamel work, and design, advancing human technical capabilities.'
                            },
                            {
                                title: 'Cultural Exchange',
                                description: 'Trade in jewelry materials spread ideas, techniques, and artistic styles between civilizations, fostering cultural connections.'
                            },
                            {
                                title: 'Historical Documentation',
                                description: 'Archaeological jewelry discoveries reveal migration patterns, trade networks, technological advancement, and social customs.'
                            },
                            {
                                title: 'Political Power',
                                description: 'Crown jewels, royal regalia, and diplomatic gifts reinforced authority, legitimized rulers, and sealed alliances.'
                            },
                            {
                                title: 'Personal Identity',
                                description: 'From ancient times to today, jewelry expresses individual personality, commemorates milestones, and preserves memories.'
                            }
                        ].map((impact, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-jewelry-gold/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center mb-4 text-jewelry-dark font-display font-bold text-xl">
                                    {index + 1}
                                </div>
                                <h3 className="font-display text-xl text-jewelry-gold mb-3">{impact.title}</h3>
                                <p className="font-sans text-jewelry-cream/70 text-sm leading-relaxed">{impact.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Legacy */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-6">
                        The Journey Continues
                    </h2>
                    <div className="glass rounded-2xl p-8 md:p-12 space-y-6">
                        <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                            Today, jewelry continues its 75,000-year journey, blending ancient techniques with modern innovation. Contemporary
                            designers honor traditional craftsmanship while incorporating cutting-edge materials and sustainable practices.
                        </p>
                        <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                            At <strong className="text-jewelry-gold">ArtisanAlloy</strong>, we honor this timeless legacy by creating pieces that connect you
                            to centuries of artistry while celebrating your unique, modern story. Every piece we craft carries forward the spirit of
                            ancient artisans who transformed precious materials into wearable art.
                        </p>
                        <div className="pt-6">
                            <a
                                href="/collection"
                                className="inline-block px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-2xl hover:shadow-jewelry-gold/50 transition-all duration-300"
                            >
                                Explore Our Collection
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* References */}
            <section className="py-12 px-4 bg-jewelry-dark-deep">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-light rounded-xl p-6">
                        <h3 className="font-display text-2xl text-jewelry-gold mb-4">Research Sources & References</h3>
                        <p className="font-sans text-jewelry-cream/60 text-sm leading-relaxed mb-4">
                            This historical overview has been compiled from archaeological research, museum collections, and academic sources including:
                        </p>
                        <ul className="font-sans text-jewelry-cream/60 text-sm space-y-2">
                            <li>• Wikipedia articles on ancient civilizations and their jewelry traditions</li>
                            <li>• Archaeological journals documenting excavations at major sites (Mohenjo-Daro, Valley of the Kings, Royal Cemetery of Ur)</li>
                            <li>• Museum collections: British Museum, Egyptian Museum Cairo, Metropolitan Museum of Art</li>
                            <li>• Academic research on Indus Valley, Egyptian, Mesopotamian, Greek, Roman, Chinese, and African material culture</li>
                            <li>• Historical records on trade routes, craftsmanship techniques, and cultural significance of jewelry</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default History;
