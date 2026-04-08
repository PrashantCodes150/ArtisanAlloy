import { Gem, ExternalLink } from 'lucide-react';
import { jewelryTypesData } from '../data/jewelryTypesData';
import jewelleryTypesBg from '../assets/backgrounds/jewellery_types_bg.png';

const JewelleryTypes = () => {
    return (
        <div className="pt-24 bg-jewelry-dark">
            {/* Hero Section */}
            <section className="py-32 px-4 text-center bg-gradient-to-b from-jewelry-dark-deep to-jewelry-dark relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.07]">
                    <img
                        src={jewelleryTypesBg}
                        alt=""
                        className="w-full h-full object-cover grayscale contrast-125"
                    />
                </div>
                <div className="relative z-10">
                    <Gem className="w-20 h-20 text-jewelry-gold mx-auto mb-8 animate-pulse" />
                    <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-6 pb-3">
                        The Encyclopedia of Adornment
                    </h1>
                    <p className="font-sans text-jewelry-cream/80 text-xl max-w-4xl mx-auto leading-relaxed">
                        A comprehensive exploration of 32 major types of jewelry recorded in human history,
                        with generated imagery representing each artifact.
                    </p>
                </div>
            </section>

            {/* Categories Navigation */}
            <section className="py-12 px-4 glass sticky top-20 z-40 border-y border-jewelry-gold/20">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8">
                    {jewelryTypesData.map((cat) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            className="font-sans text-sm md:text-base text-jewelry-cream/70 hover:text-jewelry-gold transition-colors duration-300 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-jewelry-gold/40"></span>
                            {cat.name}
                        </a>
                    ))}
                </div>
            </section>

            {/* Detailed Categories */}
            <section className="py-20 px-4 space-y-32">
                {jewelryTypesData.map((category) => (
                    <div key={category.id} id={category.id} className="max-w-7xl mx-auto scroll-mt-40">
                        <div className="mb-12 space-y-4">
                            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-jewelry-gold/10 text-jewelry-gold mb-4">
                                {<category.icon className="w-10 h-10" />}
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl text-jewelry-gold">{category.name}</h2>
                            <p className="font-sans text-jewelry-cream/80 text-lg leading-relaxed max-w-3xl">
                                {category.description}
                            </p>
                            <div className="h-1 w-24 bg-gradient-gold rounded-full"></div>
                        </div>

                        {/* Types Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.types.map((type, tIdx) => (
                                <div
                                    key={tIdx}
                                    className="glass rounded-2xl overflow-hidden border border-jewelry-gold/10 hover:border-jewelry-gold/40 transition-all duration-500 group flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark-deep/80 via-transparent to-transparent z-10"></div>
                                        <img
                                            src={type.image}
                                            alt={type.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-widest text-jewelry-gold/80 font-sans border border-jewelry-gold/30 px-2 py-0.5 rounded bg-jewelry-dark-deep/60 backdrop-blur-sm">
                                                    {type.origin}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-jewelry-cream/40 font-sans bg-jewelry-dark-deep/60 backdrop-blur-sm px-2 py-1 rounded">
                                                <ExternalLink className="w-3 h-3" />
                                                {type.source}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-3 flex-grow bg-jewelry-dark/40">
                                        <h3 className="font-display text-2xl text-jewelry-gold group-hover:translate-x-1 transition-transform duration-300">
                                            {type.name}
                                        </h3>
                                        <p className="font-sans text-jewelry-cream/70 text-sm leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Historical Significance Footer */}
            <section className="py-24 px-4 bg-jewelry-dark-deep border-t border-jewelry-gold/20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="font-display text-4xl text-jewelry-gold">The Evolution of Craft</h2>
                    <p className="font-sans text-jewelry-cream/80 text-lg leading-relaxed italic">
                        "Jewelry is not just about vanity; it is the most intimate form of human expression.
                        Every piece tells a story of survival, status, faith, and the eternal human desire for beauty."
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                        <div className="text-center">
                            <div className="text-3xl font-display text-jewelry-gold mb-2">100k+</div>
                            <div className="text-xs uppercase tracking-widest text-jewelry-cream/40">Years of History</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display text-jewelry-gold mb-2">32</div>
                            <div className="text-xs uppercase tracking-widest text-jewelry-cream/40">Historical Types</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display text-jewelry-gold mb-2">Global</div>
                            <div className="text-xs uppercase tracking-widest text-jewelry-cream/40">Cultural Reach</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display text-jewelry-gold mb-2">Infinite</div>
                            <div className="text-xs uppercase tracking-widest text-jewelry-cream/40">Artistic Value</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JewelleryTypes;
