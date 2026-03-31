import { Award, Heart, Users, Sparkles } from 'lucide-react';
import necklaceImg from '../assets/images/necklace.png';
import SEO from '../components/SEO';

const About = () => {
    const values = [
        {
            icon: Award,
            title: 'Excellence',
            description: 'We maintain the highest standards of craftsmanship in every piece we create.',
        },
        {
            icon: Heart,
            title: 'Passion',
            description: 'Our artisans pour their heart and soul into creating jewelry that tells your story.',
        },
        {
            icon: Users,
            title: 'Trust',
            description: 'Building lasting relationships with our clients through transparency and integrity.',
        },
        {
            icon: Sparkles,
            title: 'Innovation',
            description: 'Blending traditional techniques with modern design for timeless elegance.',
        },
    ];

    return (
        <div className="pt-24">
            <SEO
                title="About Us - Our Story & Heritage | F Jewelry"
                description="Discover the F Jewelry story. Since 1990, we've been crafting timeless, handmade jewelry using ethically sourced materials. Learn about our artisans and values."
                keywords="about F Jewelry, jewelry craftsmanship, handmade jewelry, ethical jewelry, jewelry artisans, luxury jewelry India"
                url="https://f-jewelry.com/about"
            />
            {/* Hero Section */}
            <section className="relative h-96 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={necklaceImg} alt="About F Jewelry" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-jewelry-dark-deep/90 to-jewelry-dark"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
                        Our Story
                    </h1>
                    <p className="font-sans text-jewelry-cream/80 text-lg max-w-2xl mx-auto">
                        Crafting timeless elegance for over three decades
                    </p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96 rounded-2xl overflow-hidden glass">
                            <img src={necklaceImg} alt="Jewelry Craftsmanship" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="font-display text-4xl font-bold text-jewelry-gold mb-6">
                                A Legacy of Excellence
                            </h2>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-4">
                                Founded in 1990, F Jewelry began as a small family workshop with a simple vision: to create jewelry that transcends time and trends. What started as a passion project has grown into a renowned name in luxury jewelry.
                            </p>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-4">
                                Our master artisans combine generations of traditional goldsmithing techniques with contemporary design sensibilities. Each piece is meticulously handcrafted, ensuring that no two items are exactly alike.
                            </p>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                                We source only the finest materials - ethically mined diamonds, precious gemstones, and conflict-free gold. Our commitment to sustainability and ethical practices is as important as our commitment to beauty.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 px-4 bg-gradient-to-r from-jewelry-dark to-jewelry-dark-deep">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-4">
                            Our Values
                        </h2>
                        <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
                            The principles that guide everything we create
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="glass rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-jewelry-gold/20 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-jewelry-dark" />
                                    </div>
                                    <h3 className="font-display text-2xl text-jewelry-cream mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="font-sans text-jewelry-cream/70 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Craftsmanship Process */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-4">
                            The Art of Creation
                        </h2>
                        <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
                            Every piece goes through a meticulous process to ensure perfection
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                step: '01',
                                title: 'Design & Concept',
                                description: 'Our designers sketch and refine concepts, drawing inspiration from nature, architecture, and timeless beauty.',
                            },
                            {
                                step: '02',
                                title: 'Material Selection',
                                description: 'We handpick the finest ethically sourced gemstones and precious metals for each creation.',
                            },
                            {
                                step: '03',
                                title: 'Master Crafting',
                                description: 'Skilled artisans bring the design to life using traditional techniques passed down through generations.',
                            },
                            {
                                step: '04',
                                title: 'Quality Assurance',
                                description: 'Each piece undergoes rigorous inspection to meet our exacting standards of excellence.',
                            },
                        ].map((process, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center hover:shadow-xl hover:shadow-jewelry-gold/10 transition-all duration-300"
                            >
                                <div className="text-7xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent opacity-20">
                                    {process.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display text-2xl text-jewelry-gold mb-2">
                                        {process.title}
                                    </h3>
                                    <p className="font-sans text-jewelry-cream/80 leading-relaxed">
                                        {process.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-jewelry-dark to-jewelry-dark-deep">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-6">
                        Meet Our Artisans
                    </h2>
                    <p className="font-sans text-jewelry-cream/80 max-w-3xl mx-auto leading-relaxed mb-8">
                        Behind every piece of F Jewelry is a team of passionate craftspeople dedicated to perfection. Our master jewelers, gem specialists, and designers work in harmony to create wearable art that celebrates your most precious moments.
                    </p>
                    <p className="font-sans text-jewelry-cream/70 italic">
                        "We don't just make jewelry; we craft memories that last forever." - F Jewelry Team
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
