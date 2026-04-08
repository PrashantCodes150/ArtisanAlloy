import { motion } from 'framer-motion';

// Simple fade-in animation for whenInView effects
export const FadeIn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.div>
    );
};

// Simple slide up animation
export const SlideUp = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.div>
    );
};

// Simple stagger container for list animations
export const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

// Simple stagger item
export const StaggerItem = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
        >
            {children}
        </motion.div>
    );
};