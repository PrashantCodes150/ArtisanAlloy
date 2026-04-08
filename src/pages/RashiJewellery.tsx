import { Star, Sparkles } from 'lucide-react';
import rashiBg from '../assets/backgrounds/rashi_bg.png';

const RashiJewellery = () => {
    const rashiData = [
        {
            rashi: 'Mesh (Aries)',
            dates: 'Mar 21 - Apr 19',
            rulingPlanet: 'Mars',
            luckyStone: 'Red Coral (Moonga)',
            metal: 'Copper, Gold',
            benefits: 'Boosts confidence, courage, and leadership. Protects from enemies and accidents.',
            color: '#FF4500'
        },
        {
            rashi: 'Vrishabha (Taurus)',
            dates: 'Apr 20 - May 20',
            rulingPlanet: 'Venus',
            luckyStone: 'Diamond, White Sapphire',
            metal: 'Silver, Copper',
            benefits: 'Enhances luxury, artistic abilities, and relationships. Brings prosperity.',
            color: '#FFD700'
        },
        {
            rashi: 'Mithun (Gemini)',
            dates: 'May 21 - Jun 20',
            rulingPlanet: 'Mercury',
            luckyStone: 'Emerald (Panna)',
            metal: 'Gold, Silver',
            benefits: 'Improves communication, intelligence, and business success. Calms the mind.',
            color: '#50C878'
        },
        {
            rashi: 'Karka (Cancer)',
            dates: 'Jun 21 - Jul 22',
            rulingPlanet: 'Moon',
            luckyStone: 'Pearl (Moti)',
            metal: 'Silver',
            benefits: 'Promotes emotional balance, peace of mind, and family harmony. Enhances intuition.',
            color: '#F0EAD6'
        },
        {
            rashi: 'Simha (Leo)',
            dates: 'Jul 23 - Aug 22',
            rulingPlanet: 'Sun',
            luckyStone: 'Ruby (Manik)',
            metal: 'Gold',
            benefits: 'Strengthens authority, vitality, and success. Boosts confidence and social status.',
            color: '#DC143C'
        },
        {
            rashi: 'Kanya (Virgo)',
            dates: 'Aug 23 - Sep 22',
            rulingPlanet: 'Mercury',
            luckyStone: 'Emerald (Panna)',
            metal: 'Gold',
            benefits: 'Enhances analytical abilities, health, and precision. Improves communication.',
            color: '#50C878'
        },
        {
            rashi: 'Tula (Libra)',
            dates: 'Sep 23 - Oct 22',
            rulingPlanet: 'Venus',
            luckyStone: 'Diamond, Opal',
            metal: 'Silver, White Gold',
            benefits: 'Brings balance, beauty, and harmonious relationships. Enhances artistic talents.',
            color: '#FFC0CB'
        },
        {
            rashi: 'Vrishchik (Scorpio)',
            dates: 'Oct 23 - Nov 21',
            rulingPlanet: 'Mars',
            luckyStone: 'Red Coral (Moonga)',
            metal: 'Copper',
            benefits: 'Provides protection, courage, and determination. Wards off negative energies.',
            color: '#8B0000'
        },
        {
            rashi: 'Dhanu (Sagittarius)',
            dates: 'Nov 22 - Dec 21',
            rulingPlanet: 'Jupiter',
            luckyStone: 'Yellow Sapphire (Pukhraj)',
            metal: 'Gold',
            benefits: 'Brings wisdom, prosperity, and good fortune. Enhances spiritual growth.',
            color: '#FFD700'
        },
        {
            rashi: 'Makar (Capricorn)',
            dates: 'Dec 22 - Jan 19',
            rulingPlanet: 'Saturn',
            luckyStone: 'Blue Sapphire (Neelam)',
            metal: 'Iron, Silver',
            benefits: 'Provides discipline, focus, and career success. Removes obstacles.',
            color: '#0000CD'
        },
        {
            rashi: 'Kumbha (Aquarius)',
            dates: 'Jan 20 - Feb 18',
            rulingPlanet: 'Saturn',
            luckyStone: 'Blue Sapphire (Neelam)',
            metal: 'Silver',
            benefits: 'Encourages innovation, independence, and humanitarian pursuits.',
            color: '#4169E1'
        },
        {
            rashi: 'Meena (Pisces)',
            dates: 'Feb 19 - Mar 20',
            rulingPlanet: 'Jupiter',
            luckyStone: 'Yellow Sapphire (Pukhraj)',
            metal: 'Gold',
            benefits: 'Enhances intuition, spirituality, and compassion. Brings peace and prosperity.',
            color: '#9370DB'
        }
    ];

    return (
        <div className="pt-24 bg-jewelry-dark">
            {/* Hero Section */}
            <section className="py-28 px-4 text-center bg-gradient-to-b from-jewelry-dark-deep to-jewelry-dark relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.08]">
                    <img
                        src={rashiBg}
                        alt=""
                        className="w-full h-full object-cover scale-110"
                    />
                </div>
                {/* Celestial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                <Star className="w-16 h-16 text-jewelry-gold mx-auto mb-6 animate-pulse" />
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4 pb-3">
                    Jewellery by Rashi
                </h1>
                <p className="font-sans text-jewelry-cream/80 text-lg max-w-3xl mx-auto leading-relaxed">
                    Discover gemstones and metals aligned with your zodiac sign for good fortune and prosperity
                </p>
            </section>

            {/* Introduction */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto glass rounded-2xl p-8 md:p-12">
                    <h2 className="font-display text-3xl text-jewelry-gold mb-6">Vedic Astrology & Gemstones</h2>
                    <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-4">
                        In Vedic astrology, gemstones are believed to harness the cosmic energies of planets (Navagraha) and channel them to the wearer.
                        Each Rashi (zodiac sign) is ruled by a specific planet, and wearing the corresponding gemstone is thought to strengthen that planet's
                        positive influence while mitigating negative effects.
                    </p>
                    <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                        The right gemstone, when worn in the correct metal and finger, can enhance fortune, health, relationships, and career success.
                        Always consult with an experienced astrologer before wearing planetary gemstones for the best results.
                    </p>
                </div>
            </section>

            {/* Rashi Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rashiData.map((rashi, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: rashi.color }}
                                ></div>
                                <div>
                                    <h3 className="font-display text-xl text-jewelry-gold">{rashi.rashi}</h3>
                                    <p className="font-sans text-jewelry-cream/60 text-xs">{rashi.dates}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-jewelry-gold flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-sans text-jewelry-cream/70 text-xs">Ruling Planet</p>
                                        <p className="font-sans text-jewelry-cream font-semibold text-sm">{rashi.rulingPlanet}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-jewelry-rose flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-sans text-jewelry-cream/70 text-xs">Lucky Stone</p>
                                        <p className="font-sans text-jewelry-rose font-semibold text-sm">{rashi.luckyStone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-jewelry-silver flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-sans text-jewelry-cream/70 text-xs">Recommended Metal</p>
                                        <p className="font-sans text-jewelry-silver font-semibold text-sm">{rashi.metal}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-jewelry-gold/20">
                                <h4 className="font-sans font-semibold text-jewelry-gold text-xs mb-2">Benefits:</h4>
                                <p className="font-sans text-jewelry-cream/70 text-sm leading-relaxed">{rashi.benefits}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Important Notes */}
            <section className="py-16 px-4 bg-jewelry-dark">
                <div className="max-w-5xl mx-auto glass rounded-2xl p-8">
                    <h2 className="font-display text-3xl text-jewelry-gold mb-6">Important Guidelines</h2>
                    <div className="space-y-4 font-sans text-jewelry-cream/80 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Consult an Astrologer:</strong> Always seek guidance from a qualified Vedic astrologer before wearing gemstones, as incorrect stones can have adverse effects.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Natural vs Treated:</strong> Only natural, untreated gemstones provide astrological benefits. Synthetic stones have no cosmic energy.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Weight & Quality:</strong> Gemstone weight (in carats) and clarity matter. Minimum recommended weight varies by stone.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Correct Finger & Day:</strong> Each gemstone should be worn on a specific finger and activated on an auspicious day for maximum benefit.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Setting:</strong> The gemstone should touch the skin for energy transfer. Open-back settings are preferred.</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RashiJewellery;
