"use client";
import { UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { AddSongModal } from "@/app/(homepage)/_components/add-song-modal";

export const Navbar = () => {
    return (
        <nav className="bg-slate-950 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="text-white font-bold text-xl">
                    BeatWave
                </Link>
                <div className="flex items-center">
                    <AddSongModal />
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};