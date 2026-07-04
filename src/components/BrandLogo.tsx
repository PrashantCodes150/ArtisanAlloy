import React from 'react';

interface BrandLogoProps {
    className?: string;
    size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-10 h-10", size = 44 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className} flex-shrink-0 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]`}
        >
            <defs>
                <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE599" />
                    <stop offset="30%" stopColor="#D4AF37" />
                    <stop offset="70%" stopColor="#AA7C11" />
                    <stop offset="100%" stopColor="#F5D77F" />
                </linearGradient>
                <linearGradient id="diamondSparkle" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#FFE599" />
                    <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Elegant Ring */}
            <circle
                cx="50"
                cy="52"
                r="42"
                stroke="url(#luxuryGold)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
            />
            <circle
                cx="50"
                cy="52"
                r="38"
                stroke="url(#luxuryGold)"
                strokeWidth="1"
                opacity="0.4"
            />

            {/* Top Brilliant Diamond / Gemstone */}
            <g transform="translate(50, 16)">
                {/* Diamond polygon */}
                <polygon
                    points="0,-8 -7,-2 0,7 7,-2"
                    fill="url(#diamondSparkle)"
                    stroke="url(#luxuryGold)"
                    strokeWidth="0.8"
                    filter="url(#goldGlow)"
                />
                {/* Inner facet lines */}
                <line x1="-7" y1="-2" x2="7" y2="-2" stroke="#AA7C11" strokeWidth="0.5" />
                <line x1="0" y1="-8" x2="0" y2="7" stroke="#FFE599" strokeWidth="0.5" />
            </g>

            {/* Sparkles around Diamond */}
            <path d="M 38 12 L 39 10 L 40 12 L 42 13 L 40 14 L 39 16 L 38 14 L 36 13 Z" fill="url(#luxuryGold)" opacity="0.8" />
            <path d="M 61 14 L 61.5 12.5 L 62 14 L 63.5 14.5 L 62 15 L 61.5 16.5 L 61 15 L 59.5 14.5 Z" fill="url(#luxuryGold)" opacity="0.7" />

            {/* Stylized Monogram letter 'A' with Flourishes */}
            <g transform="translate(0, 4)">
                {/* Left Leg with botanical curve */}
                <path
                    d="M 50 18 C 42 38 32 58 22 76 C 20 80 16 82 14 80 C 12 78 14 74 18 70"
                    stroke="url(#luxuryGold)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Right Leg with sweeping flourish */}
                <path
                    d="M 50 18 C 58 38 68 58 78 76 C 80 80 84 82 86 80 C 88 78 86 74 82 70"
                    stroke="url(#luxuryGold)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Center Crossbar with elegant loop */}
                <path
                    d="M 32 56 C 40 58 50 50 68 56 C 72 58 68 64 62 60 C 56 56 45 54 32 56 Z"
                    fill="url(#luxuryGold)"
                />

                {/* Botanical Leaves on Left side of A */}
                <path
                    d="M 36 44 C 30 42 26 36 28 32 C 32 32 36 38 36 44 Z"
                    fill="url(#luxuryGold)"
                    opacity="0.9"
                />
                <path
                    d="M 30 52 C 22 50 18 44 20 40 C 26 40 30 46 30 52 Z"
                    fill="url(#luxuryGold)"
                    opacity="0.8"
                />
                
                {/* Small gold sphere flourish at base */}
                <circle cx="50" cy="74" r="2.5" fill="url(#diamondSparkle)" />
            </g>
        </svg>
    );
};

export default BrandLogo;
