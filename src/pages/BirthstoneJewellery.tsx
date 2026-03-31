import { Calendar, Gem } from 'lucide-react';
import birthstoneBg from '../assets/backgrounds/birthstone_bg.png';

const BirthstoneJewellery = () => {
    const birthstones = [
        {
            month: 'January',
            stone: 'Garnet',
            color: '#8B0000',
            meaning: 'Protection, friendship, and trust',
            properties: 'Garnet symbolizes constancy, faith, and truth. It is believed to protect travelers and bring peace.',
            alternatives: 'Rose Quartz'
        },
        {
            month: 'February',
            stone: 'Amethyst',
            color: '#9966CC',
            meaning: 'Peace, courage, and stability',
            properties: 'Amethyst promotes calmness, clarity, and sobriety. Associated with royalty and spiritual wisdom.',
            alternatives: 'Onyx'
        },
        {
            month: 'March',
            stone: 'Aquamarine',
            color: '#7FFFD4',
            meaning: 'Serenity, clarity, and harmony',
            properties: 'Aquamarine evokes the purity of crystal blue waters. Brings courage and clear communication.',
            alternatives: 'Bloodstone'
        },
        {
            month: 'April',
            stone: 'Diamond',
            color: '#FFFFFF',
            meaning: 'Eternal love, strength, and invincibility',
            properties: 'Diamond represents purity and strength. The ultimate symbol of everlasting love and commitment.',
            alternatives: 'White Sapphire, Quartz'
        },
        {
            month: 'May',
            stone: 'Emerald',
            color: '#50C878',
            meaning: 'Rebirth, love, and fertility',
            properties: 'Emerald symbolizes renewal and growth. Believed to grant foresight and good fortune.',
            alternatives: 'Jade, Chrysoprase'
        },
        {
            month: 'June',
            stone: 'Pearl',
            color: '#F0EAD6',
            meaning: 'Purity, wisdom, and innocence',
            properties: 'Pearl signifies purity and feminine energy. Associated with the moon and emotional balance.',
            alternatives: 'Moonstone, Alexandrite'
        },
        {
            month: 'July',
            stone: 'Ruby',
            color: '#E0115F',
            meaning: 'Passion, protection, and prosperity',
            properties: 'Ruby symbolizes vitality and royalty. Believed to bring success, devotion, and integrity.',
            alternatives: 'Carnelian'
        },
        {
            month: 'August',
            stone: 'Peridot',
            color: '#9ACD32',
            meaning: 'Strength, healing, and protection',
            properties: 'Peridot is known as the evening emerald. Protects against nightmares and negativity.',
            alternatives: 'Spinel, Sardonyx'
        },
        {
            month: 'September',
            stone: 'Sapphire',
            color: '#0F52BA',
            meaning: 'Wisdom, loyalty, and nobility',
            properties: 'Sapphire represents wisdom and divine favor. Associated with royalty and spiritual enlightenment.',
            alternatives: 'Lapis Lazuli'
        },
        {
            month: 'October',
            stone: 'Opal',
            color: '#A8C3BC',
            meaning: 'Hope, creativity, and innocence',
            properties: 'Opal displays a kaleidoscope of colors. Symbolizes faithfulness and confidence.',
            alternatives: 'Tourmaline'
        },
        {
            month: 'November',
            stone: 'Topaz',
            color: '#FFD700',
            meaning: 'Love, affection, and strength',
            properties: 'Topaz brings joy and abundance. Known for enhancing mental clarity and attracting success.',
            alternatives: 'Citrine'
        },
        {
            month: 'December',
            stone: 'Turquoise',
            color: '#40E0D0',
            meaning: 'Healing, protection, and good fortune',
            properties: 'Turquoise is a master healing stone. Protects against evil and brings good luck.',
            alternatives: 'Tanzanite, Zircon'
        }
    ];

    return (
        <div className="pt-24 bg-jewelry-dark">
            {/* Hero Section */}
            <section className="py-28 px-4 text-center bg-gradient-to-b from-jewelry-dark-deep to-jewelry-dark relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.08]">
                    <img
                        src={birthstoneBg}
                        alt=""
                        className="w-full h-full object-cover grayscale contrast-125"
                    />
                </div>
                <Calendar className="w-16 h-16 text-jewelry-gold mx-auto mb-6 animate-pulse" />
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4 pb-3">
                    Birthstone Jewellery
                </h1>
                <p className="font-sans text-jewelry-cream/80 text-lg max-w-3xl mx-auto leading-relaxed">
                    Discover your birth month's gemstone and its special meaning for good luck and protection
                </p>
            </section>

            {/* Introduction */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto glass rounded-2xl p-8 md:p-12">
                    <h2 className="font-display text-3xl text-jewelry-gold mb-6">The Tradition of Birthstones</h2>
                    <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-4">
                        The tradition of birthstones dates back to ancient times, with roots in the Breastplate of Aaron described in the Book of Exodus,
                        which contained 12 gemstones representing the 12 tribes of Israel. Over centuries, these stones became associated with the 12 months
                        of the year and the 12 zodiac signs.
                    </p>
                    <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                        Today, birthstone jewelry is cherished for its personal significance and beauty. Wearing your birthstone is believed to bring good luck,
                        protection, and enhanced well-being. These gems make meaningful gifts for birthdays, anniversaries, and milestone celebrations.
                    </p>
                </div>
            </section>

            {/* Birthstones Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {birthstones.map((birthstone, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group"
                            style={{ boxShadow: `0 10px 40px ${birthstone.color}20` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: birthstone.color + '40', border: `2px solid ${birthstone.color}` }}
                                >
                                    <Gem className="w-4 h-4" style={{ color: birthstone.color }} />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl text-jewelry-gold">{birthstone.month}</h3>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-display text-3xl mb-2" style={{ color: birthstone.color }}>
                                    {birthstone.stone}
                                </h4>
                                <p className="font-sans text-jewelry-cream/60 text-sm italic">{birthstone.meaning}</p>
                            </div>

                            <p className="font-sans text-jewelry-cream/80 text-sm leading-relaxed mb-4">
                                {birthstone.properties}
                            </p>

                            <div className="pt-4 border-t border-jewelry-gold/20">
                                <h5 className="font-sans font-semibold text-jewelry-gold text-xs mb-2">Alternative Stones:</h5>
                                <p className="font-sans text-jewelry-cream/70 text-sm">{birthstone.alternatives}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gifting Guide */}
            <section className="py-16 px-4 bg-jewelry-dark">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl text-jewelry-gold text-center mb-12">Birthstone Gifting Guide</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass rounded-2xl p-8">
                            <div className="text-jewelry-gold mb-4">
                                <Gem className="w-12 h-12" />
                            </div>
                            <h3 className="font-display text-2xl text-jewelry-gold mb-4">Personalized Gifts</h3>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed text-sm">
                                Birthstone jewelry makes deeply personal gifts. Consider rings, necklaces, or bracelets featuring the recipient's
                                birthstone for birthdays, graduations, or special milestones.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-8">
                            <div className="text-jewelry-rose mb-4">
                                <Gem className="w-12 h-12" />
                            </div>
                            <h3 className="font-display text-2xl text-jewelry-gold mb-4">Family Jewelry</h3>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed text-sm">
                                Mother's rings or necklaces featuring children's birthstones create treasured family heirlooms.
                                Combine multiple birthstones to represent loved ones.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-8">
                            <div className="text-jewelry-silver mb-4">
                                <Gem className="w-12 h-12" />
                            </div>
                            <h3 className="font-display text-2xl text-jewelry-gold mb-4">Self-Care</h3>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed text-sm">
                                Treat yourself to your birthstone as a form of self-love and empowerment. Wear it daily for
                                its believed protective and luck-bringing properties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BirthstoneJewellery;
