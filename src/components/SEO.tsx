import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'product' | 'article';
    product?: {
        name: string;
        price: number;
        currency?: string;
        availability?: 'in_stock' | 'out_of_stock';
        image?: string;
        sku?: string;
        brand?: string;
        rating?: number;
        reviewCount?: number;
    };
}

const SEO = ({
    title = 'ArtisanAlloy - Luxury Handcrafted Jewelry | Timeless Elegance',
    description = 'Discover exquisite handcrafted jewelry at ArtisanAlloy. Shop premium gold, diamond, and silver jewelry for weddings, engagements, and special occasions. Free shipping on orders over ₹999.',
    keywords = 'jewelry, gold jewelry, diamond jewelry, silver jewelry, wedding jewelry, engagement rings, necklaces, earrings, bracelets, Indian jewelry, luxury jewelry, handcrafted jewelry',
    image = '/og-image.jpg',
    url = 'https://Artisan-Alloy.com',
    type = 'website',
    product,
}: SEOProps) => {
    const siteName = 'ArtisanAlloy';
    const fullTitle = title.includes('ArtisanAlloy') ? title : `${title} | ArtisanAlloy`;

    // Generate JSON-LD structured data
    const generateStructuredData = () => {
        const baseData = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            url: url,
            description: description,
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${url}/collection?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
            },
        };

        if (product) {
            return {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                image: product.image || image,
                description: description,
                brand: {
                    '@type': 'Brand',
                    name: product.brand || siteName,
                },
                sku: product.sku,
                offers: {
                    '@type': 'Offer',
                    url: url,
                    priceCurrency: product.currency || 'INR',
                    price: product.price,
                    availability: product.availability === 'out_of_stock'
                        ? 'https://schema.org/OutOfStock'
                        : 'https://schema.org/InStock',
                    seller: {
                        '@type': 'Organization',
                        name: siteName,
                    },
                },
                aggregateRating: product.rating ? {
                    '@type': 'AggregateRating',
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount || 1,
                } : undefined,
            };
        }

        return baseData;
    };

    // Organization structured data for rich snippets
    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: url,
        logo: `${url}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-1234567890',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
            'https://facebook.com/ArtisanAlloy',
            'https://instagram.com/ArtisanAlloy',
            'https://twitter.com/ArtisanAlloy',
        ],
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={siteName} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Product-specific meta (if applicable) */}
            {product && (
                <>
                    <meta property="product:price:amount" content={String(product.price)} />
                    <meta property="product:price:currency" content={product.currency || 'INR'} />
                    <meta property="product:availability" content={product.availability || 'in_stock'} />
                </>
            )}

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(generateStructuredData())}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(organizationData)}
            </script>
        </Helmet>
    );
};

export default SEO;
