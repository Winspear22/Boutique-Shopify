import React from 'react';

export default function Hero({ t }) {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
            
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
                
                <div className="h-8 flex items-end mb-6">
                    <h2 className="text-brand-accent font-bold tracking-[0.3em] text-xs md:text-sm uppercase animate-fade-in-up">
                        {t.subtitle}
                    </h2>
                </div>
                
                <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9] whitespace-nowrap">
                    {t.titleStart} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-600">
                        {t.titleEnd}
                    </span>
                </h1>

                <div className="min-h-[80px] md:min-h-[60px] flex items-start justify-center mb-12">
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        {t.description}
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                    <button className="w-full md:w-64 py-5 bg-brand-accent text-white font-black text-lg uppercase tracking-widest rounded-sm hover:bg-red-600 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,34,34,0.4)] clip-path-slant flex items-center justify-center">
                        {t.cta}
                    </button>
                </div>
            </div>

            {/* J'AI SUPPRIMÉ L'INDICATEUR DE SCROLL ICI */}

        </section>
    );
}