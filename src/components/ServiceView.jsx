import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceView({ t, viewTitle, children, setView }) {
    
    // Titre traduit
    const title = viewTitle === 'reviews' ? t.reviews.title : t.faq.title;
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pt-28 pb-8 bg-black z-30 overflow-y-auto"
        >
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Bouton de retour */}
                <button 
                    onClick={() => setView('main')}
                    className="flex items-center gap-2 mb-10 text-gray-400 hover:text-white transition-colors"
                >
                    <span className="text-2xl">←</span>
                    <span className="text-sm font-bold uppercase tracking-widest">{t.returnToMain}</span>
                </button>

                {/* Titre de la vue */}
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-12">
                    {title}
                </h1>
                
                {/* Le contenu (Avis ou FAQ) */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
            
        </motion.div>
    );
}