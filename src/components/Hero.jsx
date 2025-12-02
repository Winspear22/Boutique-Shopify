import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ t, setView }) {
    // ✅ 1. ÉTATS
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0); 
    const [isHoveringSound, setIsHoveringSound] = useState(false);
    
    // ✅ MODIF : Initialisation intelligente de isPlaying via localStorage
    const [isPlaying, setIsPlaying] = useState(() => {
        const savedState = localStorage.getItem('hero_isPlaying');
        return savedState !== 'false'; 
    });
    
    // ✅ 2. DÉTECTION MOBILE
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); 
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ✅ Sauvegarde automatique de l'état lecture/pause
    useEffect(() => {
        localStorage.setItem('hero_isPlaying', isPlaying);
    }, [isPlaying]);
    
    const videoRef = useRef(null);

    // ✅ MODIF : Fonction de démarrage qui respecte la mémoire
    const handleVideoReady = (e) => {
        const video = e.target;
        video.muted = true;
        video.defaultMuted = true;
        
        if (isPlaying) {
            video.play().catch(err => {
                console.log("Autoplay bloqué :", err);
                setIsPlaying(false); 
            });
        } else {
            video.pause(); 
        }
    };

    // Gestion du Mute
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = isMuted;
        
        if (!isMuted && volume === 0) {
            setVolume(1);
        }
    }, [isMuted]);

    // Gestion du Volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            if (volume > 0 && videoRef.current.muted) {
                videoRef.current.muted = false;
                setIsMuted(false);
            }
        }
    }, [volume]);

    const toggleMute = () => {
        if (isMuted) {
            setVolume(1);
            setIsMuted(false);
        } else {
            setVolume(0);
            setIsMuted(true);
        }
    };

    // Gestion Play/Pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (newVol === 0) setIsMuted(true);
        else setIsMuted(false);
    };

    const videoSrc = "https://res.cloudinary.com/difa0vc4z/video/upload/v1764530025/WhatsApp_Vid%C3%A9o_2025-11-30_%C3%A0_16.12.57_c0f94f4a_p7flvr.mp4";

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-black">
            
            {/* --- VIDÉO UNIQUE --- */}
            <video 
                ref={videoRef}
                key={isMobile ? "mobile" : "desktop"}
                src={videoSrc}
                autoPlay={isPlaying} 
                loop 
                muted 
                playsInline 
                onCanPlay={handleVideoReady}
                className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${isMobile ? '' : 'opacity-80'}`}
            />

            {/* --- MASQUES ET FILTRES --- */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
            
            {/* ✅ CONTRÔLE SON EN HAUT À DROITE */}
            <div className="absolute top-24 right-8 z-30 flex flex-col items-end gap-4">
                
                {/* 1. GROUPE VOLUME (Slider + Mute) */}
                <div 
                    className="flex items-center gap-4 flex-row-reverse"
                    onMouseEnter={() => setIsHoveringSound(true)}
                    onMouseLeave={() => setIsHoveringSound(false)}
                >
                    {/* Bouton Mute/Unmute */}
                    <button 
                        onClick={toggleMute}
                        className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 group shadow-lg z-20 relative"
                    >
                        <AnimatePresence mode="wait">
                            {isMuted || volume === 0 ? (
                                <motion.svg key="mute" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </motion.svg>
                            ) : (
                                <motion.svg key="unmute" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Slider de volume */}
                    <AnimatePresence>
                        {isHoveringSound && (
                            <motion.div 
                                initial={{ opacity: 0, width: 0, x: 20 }}
                                animate={{ opacity: 1, width: "auto", x: 0 }}
                                exit={{ opacity: 0, width: 0, x: 20 }}
                                className="bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/10 flex items-center pr-4 pl-4 h-12 z-10"
                            >
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05" 
                                    value={volume} 
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1 appearance-none bg-white/20 rounded-full outline-none cursor-pointer rotate-180 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. BOUTON PLAY/PAUSE */}
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 group shadow-lg"
                >
                    <AnimatePresence mode="wait">
                        {isPlaying ? (
                            <motion.svg key="pause" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </motion.svg>
                        ) : (
                            <motion.svg key="play" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </button>

            </div>

            {/* LE CONTENU TEXTE */}
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
                <div className="h-8 flex items-end mb-6">
                    <h2 className="text-brand-accent font-bold tracking-[0.3em] text-xs md:text-sm uppercase animate-fade-in-up">{t.subtitle}</h2>
                </div>
                
                {/* ✅ MODIF : TITRE SUR 3 LIGNES */}
               <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9] whitespace-nowrap">
                    {t.line1} <br/>
                    {t.line2} <br/>
                    {t.line3} <br/>
                    {/* Seule la dernière ligne "Longtemps" a le dégradé */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-600">
                        {t.line4}
                    </span>
                </h1>

                <div className="min-h-[80px] md:min-h-[60px] flex items-start justify-center mb-12">
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">{t.description}</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                    <button 
                        onClick={() => setView('shop')} 
                        className="w-full md:w-64 py-5 bg-brand-accent text-white font-black text-lg uppercase tracking-widest rounded-sm hover:bg-red-600 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,34,34,0.4)] clip-path-slant flex items-center justify-center cursor-pointer"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>

        </section>
    );
}