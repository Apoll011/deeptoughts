import React, { useState, useRef, useEffect, useCallback } from "react";
import { Pause, Play, Volume2, Volume1, VolumeX, SkipBack, SkipForward, Settings } from "lucide-react";
import type { MediaAttachment } from "../types.ts";

export const AudioPlayer: React.FC<{ media: MediaAttachment }> = ({ media }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(media.duration || 0);
    const [volume, setVolume] = useState(0.7);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const playbackRef = useRef<HTMLDivElement>(null);

    // Format time to display as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle play/pause
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle time update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (!isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('durationchange', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Update playback rate
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // Handle seeking
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const progressRect = progressRef.current.getBoundingClientRect();
            const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
            const seekTime = seekPosition * duration;

            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Skip forward/backward
    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                Math.max(audioRef.current.currentTime + seconds, 0),
                duration
            );
        }
    };

    // Get volume icon based on current volume
    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="w-5 h-5 text-gray-600" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5 text-gray-600" />;
        return <Volume2 className="w-5 h-5 text-gray-600" />;
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!playerRef.current) return;

            // Check if the player is in the viewport
            const rect = playerRef.current.getBoundingClientRect();
            const isInViewport = 
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth);

            if (!isInViewport) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    skip(10);
                    break;
                case 'ArrowLeft':
                    skip(-10);
                    break;
                case 'ArrowUp':
                    setVolume(prev => Math.min(prev + 0.1, 1));
                    break;
                case 'ArrowDown':
                    setVolume(prev => Math.max(prev - 0.1, 0));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle click outside for dropdowns
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
            setShowVolumeSlider(false);
        }
        if (playbackRef.current && !playbackRef.current.contains(e.target as Node)) {
            setShowPlaybackOptions(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);


    return (
        <div 
            ref={playerRef}
            className="bg-white rounded-2xl p-6 my-5 shadow-xl w-full border border-gray-200 transition-all duration-300 hover:shadow-2xl"
            style={{
                boxShadow: isHovering ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <audio ref={audioRef} src={media.url} preload="metadata" />

            {/* Title and caption */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{media.caption}</h3>
                <div className="text-xs text-gray-600 opacity-80">
                    {formatTime(duration)} • {playbackRate}x speed
                </div>
            </div>

            {/* Waveform visualization */}
            <div
                ref={progressRef}
                className="flex items-center justify-center space-x-0.5 h-32 px-2 cursor-pointer mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100"
                onClick={handleSeek}
                style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)' }}
            >
                {media.waveform?.map((height, index) => {
                    const isActive = index <= (currentTime / duration) * (media.waveform?.length || 1);
                    const animationDelay = `${index * 0.01}s`;
                    const barHeight = Math.max(height * 100, 5);

                    return (
                        <div
                            key={index}
                            className={`rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                            }`}
                            style={{
                                height: `${barHeight}%`,
                                width: `${100 / (media.waveform?.length || 1)}%`,
                                maxWidth: '6px',
                                minWidth: '3px',
                                minHeight: '4px',
                                transform: isPlaying
                                    ? `scaleY(${isActive ? 1 + (Math.sin(Date.now() / 150 + index) * 0.2) : 1})`
                                    : `scaleY(${isActive ? 1.1 : 1})`,
                                transition: isPlaying
                                    ? 'transform 0.1s ease, background 0.2s ease'
                                    : 'transform 0.3s ease, background 0.3s ease',
                                animationDelay,
                                animation: isPlaying && isActive ? 'waveform-pulse 1s infinite' : 'none'
                            }}
                        />
                    );
                })}
            </div>

            {/* Time display */}
            <div className="flex justify-between text-xs text-gray-700 mb-5 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
            </div>

            {/* Main controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4 sm:space-x-5 mx-auto sm:mx-0">
                    <button 
                        onClick={() => skip(-10)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 sm:p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                        title="Skip back 10 seconds"
                    >
                        <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>

                    <button
                        onClick={togglePlayPause}
                        className="bg-blue-500 shadow-lg rounded-full p-5 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        style={{
                            boxShadow: isPlaying 
                                ? '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)' 
                                : '0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                        }}
                    >
                        {isPlaying ? (
                            <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        ) : (
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" />
                        )}
                    </button>

                    <button 
                        onClick={() => skip(10)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 sm:p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                        title="Skip forward 10 seconds"
                    >
                        <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                </div>

                <div className="flex items-center space-x-4 mx-auto sm:mx-0">
                    <div className="relative" ref={playbackRef}>
                        <button 
                            onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors"
                            title="Playback settings"
                        >
                            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        </button>

                        {showPlaybackOptions && (
                            <div className="absolute right-0 bottom-14 bg-white shadow-xl rounded-lg p-3 z-10 w-48 border border-gray-200 animate-fadeIn">
                                <p className="text-xs font-semibold text-gray-800 mb-2">Playback Speed</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3].map(rate => (
                                        <button 
                                            key={rate} 
                                            onClick={() => setPlaybackRate(rate)}
                                            className={`px-2 py-2 text-sm rounded-md transition-all ${
                                                playbackRate === rate 
                                                    ? 'bg-blue-500 text-white font-bold shadow-sm' 
                                                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                            }`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={volumeRef}>
                        <button 
                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors"
                            title="Volume control"
                        >
                            {getVolumeIcon()}
                        </button>

                        {showVolumeSlider && (
                            <div className="absolute right-0 bottom-14 bg-white shadow-xl rounded-lg p-4 z-10 border border-gray-200 animate-fadeIn">
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => setVolume(0)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <VolumeX className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.01" 
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-28 h-2 accent-blue-500"
                                    />
                                    <button 
                                        onClick={() => setVolume(1)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Volume2 className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add CSS animation */}
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.1; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes waveform-pulse {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; transform: scaleY(1.05); }
                    100% { opacity: 0.9; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};
