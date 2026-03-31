import { motion } from 'framer-motion';
import { Users, Award, Gem, Clock } from 'lucide-react';

const stats = [
    { icon: Users, value: '50,000+', label: 'Happy Customers', color: 'from-purple-500 to-pink-500' },
    { icon: Award, value: '30+', label: 'Years of Excellence', color: 'from-jewelry-gold to-yellow-400' },
    { icon: Gem, value: '10,000+', label: 'Unique Designs', color: 'from-blue-500 to-cyan-400' },
    { icon: Clock, value: '24/7', label: 'Customer Support', color: 'from-green-500 to-emerald-400' },
];

const StatsSection = () => {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-jewelry-dark via-jewelry-dark-deep to-jewelry-dark" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-jewelry-gold/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jewelry-rose/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="text-center group"
                        >
                            {/* Icon with gradient background */}
                            <div className="relative inline-flex mb-4">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-20 group-hover:opacity-40 blur-xl transition-opacity`} />
                                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Value */}
                            <motion.div
                                className="font-display text-3xl md:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2"
                                initial={{ scale: 0.5 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                            >
                                {stat.value}
                            </motion.div>

                            {/* Label */}
                            <p className="font-sans text-jewelry-cream/70 text-sm">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
