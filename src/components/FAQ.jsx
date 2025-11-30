import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="border-b border-white/10 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-white group-hover:text-brand-accent transition-colors">
                    {question}
                </span>
                <span className={`ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 transition-all duration-300 ${isOpen ? 'bg-brand-accent border-brand-accent rotate-45' : 'group-hover:border-brand-accent'}`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-400 leading-relaxed pr-12">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ({ t }) {
    return (
        // ✅ bg-brand-dark : Un fond sombre dédié pour l'encadrer
        <section className="py-20 bg-brand-dark relative z-20">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-12 text-center">
                    {t.title}
                </h2>
                
                <div className="space-y-2">
                    {t.items.map((item, index) => (
                        <FAQItem key={index} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}