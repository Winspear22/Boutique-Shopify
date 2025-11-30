import React from 'react';
import { motion } from 'framer-motion';

// Icônes SVG personnalisées
const Icons = {
    resistance: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    muscle: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    feather: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8L2 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

export default function Features({ t }) {
    const iconsList = [Icons.resistance, Icons.muscle, Icons.feather];

    return (
        <section id="features" className="scroll-mt-32 py-32 bg-transparent relative z-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Titres */}
                <div className="text-center mb-24">
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-accent font-bold tracking-[0.2em] text-sm uppercase mb-4"
                    >
                        {t.subtitle}
                    </motion.h3>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
                    >
                        {t.title}
                    </motion.h2>
                </div>

                {/* Grille */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.cards.map((card, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-10 bg-brand-gray/10 backdrop-blur-sm border border-white/5 hover:border-brand-accent/30 transition-all duration-500 rounded-xl overflow-hidden hover:-translate-y-2"
                        >
                            {/* Fond dégradé au survol */}
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Icône */}
                            <div className="relative z-10 w-16 h-16 bg-brand-black rounded-2xl border border-white/10 flex items-center justify-center text-white mb-8 group-hover:text-brand-accent group-hover:border-brand-accent/50 transition-colors shadow-lg">
                                {iconsList[index]}
                            </div>
                            
                            {/* Texte */}
                            <h3 className="relative z-10 text-xl font-bold text-white mb-4 uppercase italic">
                                {card.title}
                            </h3>
                            <p className="relative z-10 text-gray-400 leading-relaxed font-light text-sm">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}