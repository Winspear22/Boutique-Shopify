import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// On ajoute la prop 'ui' pour recevoir les textes d'interface
function VideoCard({ videoSrc, title, index, onExpand, isExpanded, anyExpanded, ui }) {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // États
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [hasError, setHasError] = useState(false);

    const shouldBeActive = isExpanded || (isHovered && !anyExpanded);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || hasError) return;

        if (shouldBeActive) {
            if (isExpanded) {
                video.muted = false;
                video.volume = volume;
            } else {
                video.muted = true;
            }
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    video.muted = true;
                    video.play();
                });
            }
            setIsPlaying(true);
        } else {
            video.pause();
            if (!isExpanded) video.currentTime = 0;
            setIsPlaying(false);
        }
    }, [shouldBeActive, isExpanded, volume, hasError]);

    const handleTimeUpdate = () => {
        if (videoRef.current && (isPlaying || isExpanded)) {
            setCurrentTime(videoRef.current.currentTime);
            const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percent || 0);
        }
    };

    const handleLoadedMetadata = () => { if (videoRef.current) setDuration(videoRef.current.duration); };
    const handleSeek = (e) => { e.stopPropagation(); if(videoRef.current){ const newTime = (parseFloat(e.target.value)/100)*videoRef.current.duration; videoRef.current.currentTime = newTime; setProgress(e.target.value); }};
    const handleVolumeChange = (e) => { e.stopPropagation(); const newVol = parseFloat(e.target.value); setVolume(newVol); if(videoRef.current) videoRef.current.volume = newVol; };
    const togglePlay = (e) => { e.stopPropagation(); if(videoRef.current.paused){ videoRef.current.play(); setIsPlaying(true); } else { videoRef.current.pause(); setIsPlaying(false); }};
    const formatTime = (time) => { const m = Math.floor(time/60); const s = Math.floor(time%60); return `${m}:${s<10?'0':''}${s}`; };

    return (
        <motion.div 
            layout
            layoutId={`video-card-${index}`}
            onClick={() => !isExpanded && onExpand(index)}
            className={`relative bg-brand-gray/20 overflow-hidden border border-white/5 group cursor-pointer 
                ${isExpanded 
                    ? 'fixed inset-0 z-50 m-auto h-[85vh] aspect-[9/16] rounded-2xl shadow-2xl bg-black w-auto max-w-[90vw]' 
                    : 'w-full aspect-[9/16] rounded-lg'}`}
            style={{ 
                zIndex: isExpanded ? 50 : 1,
                willChange: 'transform, width, height' 
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
                delay: isExpanded ? 0 : index * 0.1, 
                layout: { duration: 0.4, type: "spring", damping: 25, stiffness: 120 } 
            }}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => !isExpanded && setIsHovered(false)}
        >
            {!hasError ? (
                <video 
                    ref={videoRef}
                    crossOrigin="anonymous"
                    src={videoSrc} 
                    loop 
                    playsInline
                    onError={() => setHasError(true)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className={`w-full h-full object-cover transition-all duration-700 will-change-transform
                        ${(shouldBeActive) ? 'scale-100 grayscale-0' : 'scale-110 grayscale opacity-60'}`}
                    onClick={isExpanded ? togglePlay : undefined}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="text-xs font-mono uppercase tracking-widest">Erreur</span>
                </div>
            )}

            {!isExpanded && (
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${(isHovered) ? 'opacity-0' : 'opacity-100'}`}></div>
            )}

            {isExpanded && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onExpand(null); }}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-accent transition-colors border border-white/10 group/close"
                >
                    <svg className="w-4 h-4 fill-current group-hover/close:rotate-90 transition-transform duration-300" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            )}

            {isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-2xl font-black text-white uppercase italic">{title}</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/70 w-8 text-right">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 h-1 bg-white/20 rounded-lg group/seek cursor-pointer">
                                <input type="range" min="0" max="100" value={progress} onChange={handleSeek} onClick={(e)=>e.stopPropagation()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                                <div className="h-full bg-brand-accent rounded-lg relative" style={{ width: `${progress}%` }}>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity shadow-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-white/70 w-8">{formatTime(duration)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm border border-white/10 text-white hover:text-brand-accent hover:bg-white/20 transition-all">
                                {isPlaying ? (
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                ) : (
                                    <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                )}
                            </button>

                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group/vol">
                                {/* Volume traduit */}
                                <span className="text-[10px] font-bold text-white/70">{ui.vol}</span>
                                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} onClick={(e)=>e.stopPropagation()} className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-brand-accent"/>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300">
                    <h3 className={`font-black text-white uppercase italic mb-2 transition-all duration-300 ${isHovered ? 'translate-y-0 text-white' : 'translate-y-2 text-gray-300'}`}>
                        {title}
                    </h3>
                    <div className={`h-1 bg-brand-accent transition-all duration-300 ${isHovered ? 'w-12' : 'w-0'}`}></div>
                </div>
            )}
        </motion.div>
    );
}

export default function TrainingVideos({ t }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    // ✅ ON UTILISE LES TITRES DU DICTIONNAIRE
    const videos = [
        { src: "https://res.cloudinary.com/difa0vc4z/video/upload/v1764247337/demo1_izng2q.mp4", title: t.training.cards[0].title },
        { src: "https://res.cloudinary.com/difa0vc4z/video/upload/v1764257461/Boxeur_avec_mitaines_et_%C3%A9lastiques_onqbvu.mp4", title: t.training.cards[1].title },
        { src: "https://res.cloudinary.com/difa0vc4z/video/upload/v1764257462/Boxer_Shadow_Boxing_Video_Generation_zfnty7.mp4", title: t.training.cards[2].title }
    ];

    return (
        <section id="training" className="py-32 bg-gradient-to-b from-transparent to-brand-black relative overflow-hidden z-20">
            <AnimatePresence>
                {expandedIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
                        onClick={() => setExpandedIndex(null)}
                    />
                )}
            </AnimatePresence>

            <LayoutGroup>
                <div className="text-center mb-20 px-6 relative z-10">
                    {/* Titres traduits */}
                    <h3 className="text-brand-accent font-bold tracking-[0.2em] text-sm uppercase mb-4">{t.training.subtitle}</h3>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                        {t.training.titleStart} <br/> {t.training.titleEnd}
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {videos.map((vid, idx) => (
                            <VideoCard 
                                key={idx} 
                                videoSrc={vid.src} 
                                title={vid.title} 
                                index={idx} 
                                onExpand={setExpandedIndex} 
                                isExpanded={expandedIndex === idx}
                                anyExpanded={expandedIndex !== null}
                                ui={t.training.ui} // ✅ On passe les textes d'interface
                            />
                        ))}
                    </div>
                </div>
            </LayoutGroup>
        </section>
    );
}