import React from 'react';

export default function Footer({ t }) {
    return (
        <footer className="bg-brand-black/80 backdrop-blur-md border-t border-white/5 py-20 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Structure en grille 3 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center">
                    
                    {/* Colonne 1 : Brand */}
                    <div className="flex flex-col items-center md:items-start gap-4 md:justify-self-start">
                        <div className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            SHADOW<span className="text-brand-accent">STRIKE</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
                            {t.brandDesc}
                        </p>
                    </div>

                    {/* Colonne 2 : Liens (Simple) */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center md:justify-self-center">
                        {t.links.map((link, i) => (
                            <a key={i} href="#" className="text-gray-500 text-sm uppercase tracking-widest hover:text-white transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Colonne 3 : Socials */}
                    <div className="flex gap-4 justify-center md:justify-self-end">
                        {['IG', 'YT', 'TK'].map((social) => (
                            <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white hover:bg-white/5 transition-all cursor-pointer text-xs font-bold">
                                {social}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
                    © 2025 Shadow Strike Inc. {t.rights}
                </div>
            </div>
        </footer>
    );
}