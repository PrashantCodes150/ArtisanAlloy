import { Shield, Lock, Award } from 'lucide-react';

interface TrustBadgesProps {
    variant?: 'horizontal' | 'vertical' | 'compact' | 'footer';
    showLabels?: boolean;
    className?: string;
}

const TrustBadges = ({ variant = 'horizontal', showLabels = true, className = '' }: TrustBadgesProps) => {
    const badges = [
        {
            icon: Shield,
            label: '100% Secure',
            sublabel: 'SSL Encrypted',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
        },
        {
            icon: Award,
            label: 'Authentic',
            sublabel: '100% Genuine',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
        {
            icon: Lock,
            label: 'Safe Payments',
            sublabel: 'Razorpay Secure',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
    ];

    // Compact variant for product pages
    if (variant === 'compact') {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                {badges.slice(0, 4).map((badge) => (
                    <div
                        key={badge.label}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${badge.bgColor}`}
                    >
                        <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                        <span className="text-xs text-jewelry-cream/80 font-sans">{badge.label}</span>
                    </div>
                ))}
            </div>
        );
    }

    // Footer variant
    if (variant === 'footer') {
        return (
            <div className={`flex flex-wrap justify-center gap-6 ${className}`}>
                {badges.map((badge) => (
                    <div
                        key={badge.label}
                        className="flex items-center gap-2 group"
                    >
                        <div className={`p-1.5 rounded-lg ${badge.bgColor} group-hover:scale-110 transition-transform`}>
                            <badge.icon className={`w-4 h-4 ${badge.color}`} />
                        </div>
                        {showLabels && (
                            <span className="text-xs text-jewelry-cream/70 font-sans whitespace-nowrap">
                                {badge.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Vertical variant for sidebars
    if (variant === 'vertical') {
        return (
            <div className={`space-y-3 ${className}`}>
                {badges.map((badge) => (
                    <div
                        key={badge.label}
                        className={`flex items-center gap-3 p-3 rounded-xl ${badge.bgColor} hover:scale-[1.02] transition-transform`}
                    >
                        <badge.icon className={`w-6 h-6 ${badge.color}`} />
                        <div>
                            <p className="text-sm font-semibold text-jewelry-cream font-sans">{badge.label}</p>
                            <p className="text-xs text-jewelry-cream/60 font-sans">{badge.sublabel}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default horizontal variant
    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
            {badges.map((badge) => (
                <div
                    key={badge.label}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${badge.bgColor} hover:scale-105 transition-transform group`}
                >
                    <badge.icon className={`w-8 h-8 ${badge.color} group-hover:scale-110 transition-transform`} />
                    {showLabels && (
                        <>
                            <p className="text-sm font-semibold text-jewelry-cream text-center font-sans">
                                {badge.label}
                            </p>
                            <p className="text-xs text-jewelry-cream/60 text-center font-sans">
                                {badge.sublabel}
                            </p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

// Checkout-specific trust section
export const CheckoutTrustSection = () => (
    <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-jewelry-gold">
            <Shield className="w-5 h-5" />
            <span className="font-sans font-semibold">Secure Checkout</span>
        </div>

        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-jewelry-cream/70">
                <Lock className="w-4 h-4 text-green-400" />
                <span>256-bit SSL encryption</span>
            </div>
        </div>

        {/* Payment method icons */}
        <div className="flex items-center gap-2 pt-2 border-t border-jewelry-gold/20">
            <span className="text-xs text-jewelry-cream/50 font-sans">We Accept:</span>
            <div className="flex gap-1">
                {['Visa', 'MC', 'UPI', 'Razorpay'].map((method) => (
                    <span
                        key={method}
                        className="px-2 py-0.5 rounded text-[10px] bg-jewelry-dark-light text-jewelry-cream/60 font-sans"
                    >
                        {method}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

// Live viewer count component
export const LiveViewerCount = ({ productId }: { productId: string }) => {
    // In production, this would connect to a real-time service
    // For now, we'll simulate with a semi-random number
    const getViewerCount = () => {
        const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 5 + (hash % 20); // Returns 5-24 viewers
    };

    const viewerCount = getViewerCount();

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-jewelry-cream/70 font-sans">
                <span className="text-green-400 font-semibold">{viewerCount}</span> people viewing this
            </span>
        </div>
    );
};

export default TrustBadges;
