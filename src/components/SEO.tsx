import { useEffect } from 'react';

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
    title = 'F Jewelry - Luxury Handcrafted Jewelry | Timeless Elegance',
    description = 'Discover exquisite handcrafted jewelry at F Jewelry. Shop premium gold, diamond, and silver jewelry for weddings, engagements, and special occasions. Free shipping on orders over ₹999.',
    keywords = 'jewelry, gold jewelry, diamond jewelry, silver jewelry, wedding jewelry, engagement rings, necklaces, earrings, bracelets, Indian jewelry, luxury jewelry, handcrafted jewelry',
    image = '/og-image.jpg',
    url = 'https://f-jewelry.com',
    type = 'website',
    product,
}: SEOProps) => {
    const siteName = 'F Jewelry';
    const fullTitle = title.includes('F Jewelry') ? title : `${title} | F Jewelry`;

    useEffect(() => {
        document.title = fullTitle;
        
        const updateMeta = (name: string, content: string, property = false) => {
            let meta = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const updateLink = (rel: string, href: string) => {
            let link = document.querySelector(`link[rel="${rel}"]`);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        const removeExistingLD = () => {
            document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
        };

        const addStructuredData = (data: object) => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        };

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
                'https://facebook.com/fjewelry',
                'https://instagram.com/fjewelry',
                'https://twitter.com/fjewelry',
            ],
        };

        updateMeta('title', fullTitle);
        updateMeta('description', description);
        updateMeta('keywords', keywords);
        updateMeta('author', siteName);
        updateMeta('robots', 'index, follow');
        updateLink('canonical', url);

        updateMeta('og:type', type, true);
        updateMeta('og:url', url, true);
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', description, true);
        updateMeta('og:image', image, true);
        updateMeta('og:site_name', siteName, true);
        updateMeta('og:locale', 'en_IN', true);

        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:url', url);
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', image);

        if (product) {
            updateMeta('product:price:amount', String(product.price), true);
            updateMeta('product:price:currency', product.currency || 'INR', true);
            updateMeta('product:availability', product.availability || 'in_stock', true);
        }

        removeExistingLD();
        addStructuredData(generateStructuredData());
        addStructuredData(organizationData);

    }, [fullTitle, description, keywords, image, url, type, product, siteName]);

    return null;
};

export default SEO;
