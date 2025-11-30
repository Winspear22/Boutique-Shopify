import React from 'react';
import { motion } from 'framer-motion';

export default function Reviews({ t }) {
    return (
        <section id="reviews" className="scroll-mt-32 py-32 bg-brand-dark relative z-20"> {/* ✅ bg-brand-dark au lieu de transparent */}
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Titres */}
                <div className="text-center mb-20">
                    <h3 className="text-brand-accent font-bold tracking-[0.2em] text-sm uppercase mb-4">
                        {t.subtitle}
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        {t.title}
                    </h2>
                </div>

                {/* Grille d'avis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.items.map((review, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            // ✅ bg-brand-gray/30 pour le côté "verre"
                            className="bg-brand-gray/30 backdrop-blur-md border border-white/5 p-8 rounded-xl relative hover:border-brand-accent/20 transition-colors"
                        >
                            {/* Étoiles */}
                            <div className="flex gap-1 mb-6 text-brand-accent">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                ))}
                            </div>

                            <p className="text-gray-300 italic mb-6 leading-relaxed">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-gray flex items-center justify-center font-bold text-white text-xs border border-white/10">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm uppercase">{review.name}</div>
                                    <div className="text-brand-accent text-xs uppercase tracking-wider">{review.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}