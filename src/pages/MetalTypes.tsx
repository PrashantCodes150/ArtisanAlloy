import { TrendingUp, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import armsJewelryBg from '../assets/images/arms-jewelry.png';

const MetalTypes = () => {
    const [lastUpdated] = useState(new Date().toLocaleString());

    // Current approximate rates in INR (Indian Rupees) as of January 2026
    const metalRates = [
        {
            name: 'Gold (24K)',
            ratePerGram: 6850,
            ratePerTola: 79900,
            description: 'Pure gold, 99.9% purity. Ideal for coins and bars.',
            color: '#FFD700'
        },
        {
            name: 'Gold (22K)',
            ratePerGram: 6280,
            ratePerTola: 73250,
            description: 'Most popular for jewelry in India. 91.6% purity.',
            color: '#FFD700'
        },
        {
            name: 'Gold (18K)',
            ratePerGram: 5140,
            ratePerTola: 59950,
            description: 'Durable for everyday wear. 75% purity.',
            color: '#D4AF37'
        },
        {
            name: 'Silver',
            ratePerGram: 92,
            ratePerKg: 92000,
            description: 'Affordable precious metal with timeless appeal.',
            color: '#C0C0C0'
        },
        {
            name: 'Platinum',
            ratePerGram: 3650,
            ratePerTola: 42580,
            description: 'Rare, durable, and hypoallergenic. Premium choice.',
            color: '#E5E4E2'
        },
        {
            name: 'Rose Gold (18K)',
            ratePerGram: 5140,
            ratePerTola: 59950,
            description: 'Gold alloyed with copper for romantic pink hue.',
            color: '#B76E79'
        }
    ];

    const metalProperties = [
        {
            metal: 'Yellow Gold',
            purity: '24K, 22K, 18K, 14K',
            properties: 'Classic, warm tone. Hypoallergenic in pure form. Requires alloying for durability.',
            bestFor: 'Traditional jewelry, wedding bands, investment'
        },
        {
            metal: 'White Gold',
            purity: '18K, 14K',
            properties: 'Gold alloyed with white metals (palladium/nickel). Rhodium plated for shine.',
            bestFor: 'Engagement rings, modern designs, diamond settings'
        },
        {
            metal: 'Rose Gold',
            purity: '18K, 14K',
            properties: 'Gold alloyed with copper. Romantic pink hue. Increasingly popular.',
            bestFor: 'Fashion jewelry, vintage designs, unique pieces'
        },
        {
            metal: 'Silver',
            purity: '925 Sterling',
            properties: 'Affordable, versatile. Tarnishes over time but easily cleaned.',
            bestFor: 'Everyday wear, oxidized jewelry, budget-friendly options'
        },
        {
            metal: 'Platinum',
            purity: '950, 900',
            properties: 'Extremely durable, dense, naturally white. Hypoallergenic.',
            bestFor: 'Heirloom pieces, engagement rings, sensitive skin'
        },
        {
            metal: 'Palladium',
            purity: '95%',
            properties: 'Similar to platinum but lighter. Naturally white, tarnish-resistant.',
            bestFor: 'Alternative to white gold, contemporary designs'
        }
    ];

    return (
        <div className="pt-24">
            {/* Hero Section */}
            <section className="py-28 px-4 text-center bg-gradient-to-b from-jewelry-dark-deep to-jewelry-dark relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.08]">
                    <img
                        src={armsJewelryBg}
                        alt=""
                        className="w-full h-full object-cover grayscale contrast-125"
                    />
                </div>
                <div className="relative z-10">
                    <TrendingUp className="w-16 h-16 text-jewelry-gold mx-auto mb-6 animate-pulse" />
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4 pb-3">
                        Metal Types & Live Rates
                    </h1>
                    <p className="font-sans text-jewelry-cream/80 text-lg max-w-3xl mx-auto leading-relaxed mb-2">
                        Current precious metal prices in India
                    </p>
                    <div className="flex items-center justify-center gap-2 text-jewelry-cream/60 text-sm">
                        <RefreshCw className="w-4 h-4" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                    <p className="text-jewelry-rose/80 text-xs mt-2">*Rates are indicative and may vary by location and jeweler</p>
                </div>
            </section>

            {/* Live Rates */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl text-jewelry-gold text-center mb-12">Today's Rates in India</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metalRates.map((metal, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: metal.color }}
                                    ></div>
                                    <h3 className="font-display text-xl text-jewelry-gold">{metal.name}</h3>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-sans text-jewelry-cream/70 text-sm">Per Gram</span>
                                        <span className="font-sans text-jewelry-cream font-semibold text-lg">
                                            ₹{metal.ratePerGram.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {metal.ratePerTola && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-sans text-jewelry-cream/70 text-sm">Per Tola (10g)</span>
                                            <span className="font-sans text-jewelry-cream font-semibold">
                                                ₹{metal.ratePerTola.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    )}
                                    {metal.ratePerKg && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-sans text-jewelry-cream/70 text-sm">Per Kg</span>
                                            <span className="font-sans text-jewelry-cream font-semibold">
                                                ₹{metal.ratePerKg.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="font-sans text-jewelry-cream/60 text-sm leading-relaxed">
                                    {metal.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Metal Properties */}
            <section className="py-20 px-4 bg-jewelry-dark">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-display text-4xl text-jewelry-gold text-center mb-12">Metal Properties & Uses</h2>
                    <div className="space-y-6">
                        {metalProperties.map((metal, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-8 hover:shadow-xl hover:shadow-jewelry-gold/10 transition-all duration-300"
                            >
                                <div className="grid md:grid-cols-4 gap-6">
                                    <div>
                                        <h3 className="font-display text-2xl text-jewelry-gold mb-2">{metal.metal}</h3>
                                        <p className="font-sans text-jewelry-cream/60 text-sm">Purity: {metal.purity}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-sans font-semibold text-jewelry-gold text-sm mb-2">Properties</h4>
                                        <p className="font-sans text-jewelry-cream/80 text-sm leading-relaxed">{metal.properties}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-semibold text-jewelry-gold text-sm mb-2">Best For</h4>
                                        <p className="font-sans text-jewelry-cream/80 text-sm leading-relaxed">{metal.bestFor}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GST Info */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto glass rounded-2xl p-8">
                    <h2 className="font-display text-3xl text-jewelry-gold mb-6">Important Information</h2>
                    <div className="space-y-4 font-sans text-jewelry-cream/80 leading-relaxed text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">GST Rates:</strong> 3% GST on gold and silver jewelry. 5% GST on diamond and gemstone jewelry.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Making Charges:</strong> Typically 8-25% depending on design complexity and jeweler.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Hallmarking:</strong> BIS hallmark ensures purity. Mandatory for gold jewelry in India since 2021.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-jewelry-gold mt-1">•</span>
                            <span><strong className="text-jewelry-gold">Rate Fluctuation:</strong> Gold and silver prices change daily based on international markets.</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MetalTypes;
