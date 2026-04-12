import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import ringsBg from '../assets/images/rings.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="pt-24 min-h-screen bg-gradient-jewelry-dark relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.10]">
                <img
                    src={ringsBg}
                    alt=""
                    className="w-full h-full object-cover grayscale contrast-125"
                />
            </div>
            <div className="relative z-10">
                <SEO
                    title="Contact Us - Get in Touch | F Jewelry"
                    description="Contact F Jewelry for inquiries, custom orders, or support. Visit our Mumbai showroom or reach us via email and phone. We're here to help with your jewelry needs."
                    keywords="contact F Jewelry, jewelry shop Mumbai, buy jewelry, custom jewelry order, jewelry inquiry, F Jewelry phone, F Jewelry email"
                    url="https://f-jewelry.com/contact"
                />
                {/* Hero Section */}
                <section className="relative py-20 px-4 text-center">
                    <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
                        Get in Touch
                    </h1>
                    <p className="font-sans text-jewelry-cream/80 text-lg max-w-2xl mx-auto">
                        We'd love to hear from you. Reach out for inquiries, custom orders, or just to say hello.
                    </p>
                </section>

                <div className="max-w-7xl mx-auto px-4 pb-20">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="glass rounded-2xl p-8">
                                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-jewelry-dark" />
                                </div>
                                <h3 className="font-display text-xl text-jewelry-gold mb-2">Email Us</h3>
                                <p className="font-sans text-jewelry-cream/80 text-sm mb-2">
                                    For inquiries and support
                                </p>
                                <a
                                    href="mailto:contact@f-jewelry.com"
                                    className="font-sans text-jewelry-cream hover:text-jewelry-gold transition-colors"
                                >
                                    contact@f-jewelry.com
                                </a>
                            </div>

                            <div className="glass rounded-2xl p-8">
                                <div className="w-12 h-12 rounded-full bg-gradient-rose flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-display text-xl text-jewelry-gold mb-2">Call Us</h3>
                                <p className="font-sans text-jewelry-cream/80 text-sm mb-2">
                                    Mon-Sat, 10 AM - 7 PM IST
                                </p>
                                <a
                                    href="tel:+911234567890"
                                    className="font-sans text-jewelry-cream hover:text-jewelry-gold transition-colors"
                                >
                                    +91 1234567890
                                </a>
                            </div>

                            <div className="glass rounded-2xl p-8">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-jewelry-silver-dark to-jewelry-silver flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-jewelry-dark" />
                                </div>
                                <h3 className="font-display text-xl text-jewelry-gold mb-2">Visit Us</h3>
                                <p className="font-sans text-jewelry-cream/80 text-sm mb-2">
                                    Our flagship showroom
                                </p>
                                <address className="font-sans text-jewelry-cream/80 not-italic">
                                    123 Jewelry Street,<br />
                                    Colaba, Mumbai 400001<br />
                                    Maharashtra, India
                                </address>
                            </div>

                            <div className="glass rounded-2xl p-8">
                                <div className="w-12 h-12 rounded-full bg-jewelry-rose flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-display text-xl text-jewelry-gold mb-2">Business Hours</h3>
                                <div className="font-sans text-jewelry-cream/80 text-sm space-y-1">
                                    <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                                    <p>Sunday: 11:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="glass rounded-2xl p-8 md:p-12">
                                <h2 className="font-display text-3xl text-jewelry-gold mb-2">Send us a Message</h2>
                                <p className="font-sans text-jewelry-cream/70 mb-8">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block font-sans text-jewelry-cream/90 mb-2 text-sm">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark/50 border border-jewelry-gold/30 text-jewelry-cream placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold transition-colors font-sans"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block font-sans text-jewelry-cream/90 mb-2 text-sm">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark/50 border border-jewelry-gold/30 text-jewelry-cream placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold transition-colors font-sans"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block font-sans text-jewelry-cream/90 mb-2 text-sm">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-jewelry-dark/50 border border-jewelry-gold/30 text-jewelry-cream placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold transition-colors font-sans"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block font-sans text-jewelry-cream/90 mb-2 text-sm">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg bg-jewelry-dark/50 border border-jewelry-gold/30 text-jewelry-cream placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold transition-colors font-sans resize-none"
                                            placeholder="Tell us about your inquiry, custom order, or how we can help you..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-2xl hover:shadow-jewelry-gold/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        Send Message
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>

                                <div className="mt-8 pt-8 border-t border-jewelry-gold/20">
                                    <p className="font-sans text-jewelry-cream/60 text-sm">
                                        * Required fields. We respect your privacy and will never share your information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
