import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// --- IMPORTS DES COMPOSANTS ---
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Product3D from './components/Product3D';
import TrainingVideos from './components/TrainingVideos';
import Reviews from './components/Reviews'; 
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ServiceView from './components/ServiceView'; 

// ✅ NOUVEAUX IMPORTS (Indispensables pour que la boutique s'affiche)
import Shop from './components/Shop';
import Cart from './components/Cart';

// --- IMPORT DES DONNÉES ---
import { translations } from './data/translations';

export default function App() {
    const [currentView, setView] = useState('main'); 
    const [lang, setLang] = useState('fr');
    
    // Sécurité si la langue n'est pas chargée
    const t = translations[lang] || translations['fr'];

    const toggleLang = (targetLang) => {
        if (targetLang && typeof targetLang === 'string') {
            setLang(targetLang);
        } else {
            setLang(prev => {
                if (prev === 'fr') return 'en';
                if (prev === 'en') return 'de';
                if (prev === 'de') return 'it';
                // ✅ AJOUT DES NOUVELLES LANGUES
                if (prev === 'it') return 'nl';
                if (prev === 'nl') return 'sv';
                if (prev === 'sv') return 'fr'; // Retour au début
                return 'fr';
            });
        }
    };
    
    // 1. ✅ C'EST ICI QUE CA MANQUAIT : MODE BOUTIQUE
    if (currentView === 'shop') {
        return (
            <div className="bg-brand-black min-h-screen text-white antialiased selection:bg-brand-accent selection:text-white relative">
                <Cart /> {/* Le panier doit être présent ici */}
                <Shop setView={setView} />
            </div>
        );
    }

    // 2. MODE SERVICE (Avis ou FAQ)
    if (currentView === 'reviews' || currentView === 'faq') {
        const ContentComponent = currentView === 'reviews' ? Reviews : FAQ;
        const tContent = currentView === 'reviews' ? t.reviews : t.faq;
        
        return (
            <div className="bg-brand-black min-h-screen text-white antialiased selection:bg-brand-accent selection:text-white relative overflow-x-hidden">
                <Cart />
                <AnimatePresence mode="wait">
                    <ServiceView t={t} viewTitle={currentView} setView={setView} key={currentView}>
                        <ContentComponent t={tContent} />
                    </ServiceView>
                </AnimatePresence>
            </div>
        );
    }

    // 3. PAGE PRINCIPALE (Landing Page)
    return (
        <div className="bg-brand-black min-h-screen text-white antialiased selection:bg-brand-accent selection:text-white relative overflow-x-hidden">
            <Cart /> {/* Le panier (caché par défaut) */}
            
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-accent rounded-full blur-[180px] opacity-15 pointer-events-none z-0 animate-pulse-slow"></div>
            
            <div className="relative z-10">
                <Navbar t={t.nav} lang={lang} toggleLang={toggleLang} setView={setView} />
                <Hero t={t.hero} setView={setView} />
                <Features t={t.features} />
                {/*<Product3D t={t} /> */}
                <TrainingVideos t={t} />
                <Footer t={t.footer} />
            </div>
        </div>
    );
}