import type {MediaBlockProps} from "../../../../models/types.ts";
import React, {useState, useEffect, useRef} from "react";
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize, Minimize, SkipForward, SkipBack, Settings } from "lucide-react";

export const VideoBlock: React.FC<MediaBlockProps> = ({ media, className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const playbackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hasError && retryCount < maxRetries) {
            const retryTimer = setTimeout(() => {
                console.log(`Retrying video load (${retryCount + 1}/${maxRetries})...`);
                setHasError(false);
                setIsLoading(true);
                setRetryCount(prev => prev + 1);
            }, 1000 * (retryCount + 1));

            return () => clearTimeout(retryTimer);
        }
    }, [hasError, retryCount]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => {
            if (!isNaN(video.duration)) {
                setDuration(video.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('durationchange', updateDuration);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('durationchange', updateDuration);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Update playback rate
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Show/hide controls on hover
    useEffect(() => {
        if (isHovering) {
            setShowControls(true);
        } else {
            const timer = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isHovering, isPlaying]);

    // Toggle play/pause
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(error => {
                    console.error("Error playing video:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Skip forward/backward
    const skipTime = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!videoContainerRef.current) return;

        if (!document.fullscreenElement) {
            videoContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Set playback rate
    const setSpeed = (speed: number) => {
        setPlaybackRate(speed);
        setShowPlaybackOptions(false);
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !videoRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
    };

    const handleMetadataLoaded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        try {
            const videoDuration = event.currentTarget.duration;
            setDuration(videoDuration);
        } catch (error) {
            console.error("Error getting video duration:", error);
        }
    };

    const handleVideoLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleVideoError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const formatDuration = (seconds?: number): string => {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div 
            className={`rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div 
                className="relative" 
                ref={videoContainerRef}
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center z-10">
                        <div className="text-center text-white">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-sm font-medium">
                                {retryCount > 0 ? `Retrying (${retryCount}/${maxRetries})...` : 'Loading video...'}
                            </p>
                        </div>
                    </div>
                )}

                {hasError ? (
                    <div className="w-full h-64 bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center">
                        <div className="text-center text-gray-200">
                            <div className="bg-red-800 p-5 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-12 h-12">
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                                </svg>
                            </div>
                            <p className="text-base font-medium mb-2">Failed to load video</p>
                            {retryCount >= maxRetries && (
                                <p className="text-sm text-gray-300">Please check your connection and try again later</p>
                            )}
                            <button 
                                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                                onClick={() => {
                                    setHasError(false);
                                    setIsLoading(true);
                                    setRetryCount(0);
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <video
                            ref={videoRef}
                            src={media.url}
                            className="w-full h-auto"
                            preload="metadata"
                            onLoadedData={handleVideoLoad}
                            onLoadedMetadata={handleMetadataLoaded}
                            onError={handleVideoError}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onClick={togglePlayPause}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Custom Video Controls */}
                        <div 
                            className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Progress Bar */}
                            <div 
                                className="px-4 pb-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div 
                                    className="h-1.5 bg-gray-600 rounded-full overflow-hidden cursor-pointer"
                                    ref={progressRef}
                                    onClick={handleProgressClick}
                                >
                                    <div 
                                        className="h-full bg-indigo-500"
                                        style={{ width: `${(currentTime / duration) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-white text-xs mt-1">
                                    <span>{formatDuration(currentTime)}</span>
                                    <span>{formatDuration(duration)}</span>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="px-4 pb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Play/Pause Button */}
                                    <button 
                                        className="text-white hover:text-indigo-300 transition-colors"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-8 h-8" />
                                        ) : (
                                            <Play className="w-8 h-8" />
                                        )}
                                    </button>

                                    {/* Skip Buttons */}
                                    <button 
                                        className="text-white hover:text-indigo-300 transition-colors"
                                        onClick={() => skipTime(-10)}
                                    >
                                        <SkipBack className="w-5 h-5" />
                                    </button>
                                    <button 
                                        className="text-white hover:text-indigo-300 transition-colors"
                                        onClick={() => skipTime(10)}
                                    >
                                        <SkipForward className="w-5 h-5" />
                                    </button>

                                    <div className="relative w-5 h-5">
                                        <button
                                            className="text-white hover:text-indigo-300 transition-colors"
                                            onClick={toggleMute}
                                            onMouseEnter={() => setShowVolumeSlider(true)}
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-5 h-5" />
                                            ) : volume > 0.5 ? (
                                                <Volume2 className="w-5 h-5" />
                                            ) : (
                                                <Volume1 className="w-5 h-5" />
                                            )}
                                        </button>
                                        {showVolumeSlider && (
                                            <div 
                                                className="absolute bottom-full left-2 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg"
                                                onMouseEnter={() => setShowVolumeSlider(true)}
                                                onMouseLeave={() => setShowVolumeSlider(false)}
                                                ref={volumeRef}
                                            >
                                                <input 
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={isMuted ? 0 : volume}
                                                    onChange={handleVolumeChange}
                                                    className="w-24 accent-indigo-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Playback Speed */}
                                    <div className="relative">
                                        <button 
                                            className="text-white hover:text-indigo-300 transition-colors flex items-center"
                                            onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                                        >
                                            <Settings className="w-5 h-5 mr-1" />
                                            <span className="text-xs">{playbackRate}x</span>
                                        </button>
                                        {showPlaybackOptions && (
                                            <div 
                                                className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg"
                                                ref={playbackRef}
                                            >
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                    <button 
                                                        key={rate}
                                                        className={`block w-full text-left px-3 py-1 text-sm rounded ${playbackRate === rate ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-gray-700'}`}
                                                        onClick={() => setSpeed(rate)}
                                                    >
                                                        {rate}x
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Fullscreen Button */}
                                    <button 
                                        className="text-white hover:text-indigo-300 transition-colors"
                                        onClick={toggleFullscreen}
                                    >
                                        {isFullscreen ? (
                                            <Minimize className="w-5 h-5" />
                                        ) : (
                                            <Maximize className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Duration Badge (only when not playing and controls not showing) */}
                        {duration && !isPlaying && !showControls && (
                            <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
                                {formatDuration(duration)}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {media.caption && (
                <div className="p-5 bg-gray-50 border-t">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {media.caption}
                    </p>
                </div>
            )}
        </div>
    );
};
