import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ✅ Import du contexte pour contrôler le panier
import { useShopify } from '../context/ShopifyContext';

export default function Navbar({ t, lang, toggleLang, setView }) {
    const [isLangOpen, setIsLangOpen] = useState(false);
    
    // ✅ Récupération des fonctions du panier
    const { setIsCartOpen, cart } = useShopify();

    // ✅ Calcul du nombre total d'articles (pas juste le nombre de lignes)
    const cartQuantity = cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    const languages = [
        { code: 'fr', label: 'FR' },
        { code: 'en', label: 'EN' },
        { code: 'de', label: 'DE' },
        { code: 'it', label: 'IT' }
    ];

    const handleLangChange = (code) => {
        toggleLang(code); 
        setIsLangOpen(false);
    };

    const getReviewLinkName = () => {
        return t.reviews && t.reviews.subtitle ? t.reviews.subtitle : 'AVIS';
    };

    const getFaqLinkName = () => {
        return t.faq && t.faq.linkName ? t.faq.linkName : 'FAQ'; 
    };

    const handleNavClick = (view) => (e) => {
        e.preventDefault();
        if (view === 'reviews' || view === 'faq') {
            setView(view);
        } else {
            setView('main');
            const targetElement = document.getElementById(view);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md bg-black/20 border-b border-white/5 transition-all duration-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto relative">
                
                {/* Logo */}
                <div 
                    onClick={() => setView('main')}
                    className="w-auto text-2xl font-black tracking-tighter text-white uppercase italic select-none cursor-pointer hover:text-brand-accent transition-colors"
                >
                    SHADOW<span className="text-brand-accent">STRIKE</span>
                </div>

                {/* Menu Central */}
                <div className="hidden md:flex items-center justify-center space-x-2">
                    <div className="flex items-center justify-center">
                        <a href="#features" onClick={handleNavClick('features')} className="px-4 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-white transition-colors duration-300">{t.tech}</a>
                        <a href="#training" onClick={handleNavClick('training')} className="px-4 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-white transition-colors duration-300">{t.training}</a>
                        <a href="#" onClick={handleNavClick('reviews')} className="px-4 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-white transition-colors duration-300">{getReviewLinkName()}</a>
                        <a href="#" onClick={handleNavClick('faq')} className="px-4 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-white transition-colors duration-300">{getFaqLinkName()}</a>
                        <a href="https://shopify.com/93464265037/account" target="_blank" rel="noopener noreferrer" className="px-4 text-center text-xs font-bold tracking-[0.2em] text-brand-accent uppercase hover:text-white transition-colors duration-300 border border-brand-accent/30 rounded-full py-1 ml-2">Mon Espace</a>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-700 mx-6"></div>

                    {/* Langue */}
                    <div className="relative">
                        <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-12 flex items-center justify-center gap-1 text-xs font-bold tracking-widest text-white hover:text-brand-accent transition-colors uppercase">
                            {lang}
                            <span className={`text-[8px] transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        <AnimatePresence>
                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsLangOpen(false)}></div>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-20 bg-brand-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col py-1">
                                        {languages.map((l) => (
                                            <button key={l.code} onClick={() => handleLangChange(l.code)} className={`px-4 py-2 text-xs font-bold text-left hover:bg-brand-accent hover:text-white transition-colors uppercase ${lang === l.code ? 'text-brand-accent' : 'text-gray-400'}`}>
                                                {l.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Section Droite : Panier + CTA */}
                <div className="flex items-center gap-6 justify-end">
                    
                    {/* ✅ BOUTON PANIER (Sac) */}
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative group text-white hover:text-brand-accent transition-colors"
                        aria-label="Ouvrir le panier"
                    >
                        {/* Icone Sac SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>

                        {/* Badge de quantité (ne s'affiche que s'il y a des articles) */}
                        {cartQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                {cartQuantity}
                            </span>
                        )}
                    </button>

                    {/* CTA Acheter */}
                    <button 
                        onClick={() => setView('shop')}
                        className="hidden md:block group relative px-6 py-2 overflow-hidden rounded-full bg-white text-black font-bold text-sm tracking-wider hover:bg-brand-accent hover:text-white transition-all duration-300 min-w-[140px]"
                    >
                        <span className="relative z-10 whitespace-nowrap">{t.buy}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}