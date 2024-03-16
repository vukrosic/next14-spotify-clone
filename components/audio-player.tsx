import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';
import Image from 'next/image';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { AspectRatio } from './ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface AudioPlayerProps {
    id: Id<"files">;
    songUrl: string;
    title: string;
    artist: string;
    coverArt: string | null;
    handleNext: () => void;
    handlePrevious: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ id, songUrl, title, artist, coverArt, handleNext, handlePrevious }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const isFavorite = useQuery(api.files.getFavorite, { id });
    const favorite = useMutation(api.files.favorite);
    const unfavorite = useMutation(api.files.unfavorite);

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, [songUrl]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = value[0];
            setVolume(audio.volume);
        }
    };

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = value[0];
            if (isFinite(newTime)) {
                audio.currentTime = newTime;
                setCurrentTime(newTime);
            }
        }
    };


    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleFavorite = () => {
        if (isFavorite) {
            unfavorite({ id });
        } else {
            favorite({ id });
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 py-4 px-6 flex justify-start gap-y-4 items-center">
            <div className="flex items-center w-64 justify-between">
                {coverArt && (
                    <div className="w-16 h-16 rounded-md mr-4">
                        <AspectRatio ratio={1 / 1}>
                            <Image
                                src={coverArt}
                                alt={title}
                                fill
                                objectFit="cover"
                            />
                        </AspectRatio>
                    </div>
                )}
                <div>
                    <h2 className="text-white font-semibold">{title}</h2>
                    <p className="text-gray-400">{artist}</p>
                </div>
                <button
                    onClick={handleFavorite}
                    className="transform transition hover:scale-125 active:scale-150 ml-10"
                >
                    <Heart
                        size={30}
                        className={cn(
                            "text-white",
                            isFavorite && "fill-red-600"
                        )}
                    />
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <button className="bg-gray-700 rounded-full p-2 mr-2" onClick={handlePrevious}>
                    <SkipBack size={20} className="text-white" />
                </button>
                <button className="bg-green-500 rounded-full p-3 mr-2" onClick={togglePlayPause}>
                    {isPlaying ?
                        <Pause size={24} className="text-white" />
                        : <Play size={24} className="text-white" />
                    }
                </button>
                <button className="bg-gray-700 rounded-full p-2" onClick={handleNext} >
                    <SkipForward size={20} className="text-white" />
                </button>
            </div>
            <div className="flex items-center lg:space-x-14">
                <div className="flex items-center justify-center lg:space-x-4 w-[450px]">
                    <Slider
                        defaultValue={[currentTime]}
                        max={duration}
                        step={0.01}
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        className="w-48 lg:w-80"
                    />
                    <div className="text-gray-400 mr-4">
                        {formatTime(currentTime)} {isFinite(duration) ? `/ ${formatTime(duration)}` : ''}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Slider
                        defaultValue={[volume]}
                        max={1}
                        step={0.01}
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        className="w-28"
                    />
                    <Volume2 size={20} className="text-gray-400" />
                </div>
            </div>
            <audio ref={audioRef} src={songUrl} onTimeUpdate={handleTimeUpdate} />
        </div>
    );
};

export default AudioPlayer;