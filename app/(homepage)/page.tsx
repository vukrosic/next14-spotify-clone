"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Heart, Play } from "lucide-react";
import Image from "next/image";
import { FileWithUrls } from "@/types";
import AudioPlayer from "@/components/audio-player";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const Home = () => {
    const store = useMutation(api.users.store);
    const songList = useQuery(api.files.list);
    const [fileId, setFileId] = useState<Id<"files"> | null>(null);
    const [currentSong, setCurrentSong] = useState('');
    const [title, setTitle] = useState('title');
    const [artist, setArtist] = useState('');
    const [coverArt, setCoverArt] = useState<string | null>('');
    const [showFavorites, setShowFavorites] = useState(false);

    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    const handleNext = () => {
        if (currentIndex < filteredSongList.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextSong = filteredSongList[nextIndex];
            playSong(nextSong);
            setCurrentIndex(nextIndex);
        } else {
            playSong(filteredSongList[0]);
            setCurrentIndex(0);
        }
    };


    const handlePrevious = () => {
        if (currentIndex > 0) {
            const previousIndex = currentIndex - 1;
            const previousSong = filteredSongList[previousIndex];
            playSong(previousSong);
            setCurrentIndex(previousIndex);
        } else {
            const lastIndex = filteredSongList.length - 1;
            playSong(filteredSongList[lastIndex]);
            setCurrentIndex(lastIndex);
        }
    };



    useEffect(() => {
        store({});
    }, [store]);

    const playSong = (file: FileWithUrls) => {
        setFileId(file._id);
        setCurrentSong(file.songUrl);
        setArtist(file.owner.fullName);
        setCoverArt(file.imageUrl);
        setTitle(file.title);
    };

    const toggleShowFavorites = () => {
        setShowFavorites(!showFavorites);
    };

    if (songList === undefined) {
        return <div>Loading...</div>;
    }

    const filteredSongList = showFavorites ? songList.filter(file => file.favorite) : songList;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex w-full justify-between">
                    <h1 className="text-4xl font-bold mb-8">Your Music Library</h1>
                    <button
                        onClick={toggleShowFavorites}
                        className="transform transition hover:scale-125 active:scale-150 ml-10"
                    >
                        <Heart className={cn(
                            "text-white",
                            showFavorites && "fill-red-600"
                        )} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSongList.map((file) => (
                        <div
                            key={file.song}
                            className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-700 
                    duration-300 hover:scale-105 transform transition-transform cursor-pointer relative"
                            onClick={() => playSong(file)}
                        >
                            <div className="p-4">
                                {file.imageUrl && (
                                    <div className="group mb-4 rounded-md overflow-hidden">
                                        <Image
                                            src={file.imageUrl}
                                            alt={file.title}
                                            className="w-full h-48 object-cover"
                                            width={200}
                                            height={200}
                                        />
                                        <div className="absolute left-52 top-28 inset-0 flex items-center justify-center">
                                            <div className="bg-green-500 rounded-full p-2 transform 
                                            transition-transform duration-300 translate-y-full opacity-0 
                                            group-hover:opacity-100 group-hover:translate-y-6
                                            ">
                                                <Play className="text-white h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <h2 className="text-lg font-semibold">{file.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {fileId && currentSong &&
                <AudioPlayer
                    id={fileId}
                    title={title}
                    artist={artist}
                    coverArt={coverArt}
                    songUrl={currentSong}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                />}
        </div>
    );
};

export default Home;