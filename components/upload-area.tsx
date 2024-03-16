"use client";

import { useMutation } from "convex/react";
import { UploadDropzone, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export function UploadArea() {
    const [songId, setSongId] = useState<Id<"files"> | null>(null);
    const [title, setTitle] = useState<string>("");

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveSongStorageId = useMutation(api.files.saveSongStorageId);
    const saveSongAfterUpload = async (uploaded: UploadFileResponse[]) => {
        if (title === "") {
            alert("Please enter a title");
            return;
        };
        const id = await saveSongStorageId({ songStorageId: (uploaded[0].response as any).storageId, title });
        setSongId(id);
        setTitle("");
    };

    const saveImageStorageId = useMutation(api.files.saveImageStorageId);
    const saveImageAfterUpload = async (uploaded: UploadFileResponse[]) => {
        if (songId === null) return;
        await saveImageStorageId({ imageStorageId: (uploaded[0].response as any).storageId, id: songId });
        setSongId(null);
    }

    return (
        <div className="w-full mx-auto p-6 bg-slate-950 rounded-lg shadow-md">
            {!songId && (
                <div>
                    <h2 className="text-2xl text-white font-semibold mb-4">Create New Song</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block font-medium mb-2 text-white">
                            Song Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter song title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="upload" className="block font-medium mb-2 text-white">
                            Upload MP3 File
                        </label>
                        <UploadDropzone
                            uploadUrl={generateUploadUrl}
                            fileTypes={{
                                "audio/mpeg": [".mp3"],
                            }}
                            onUploadComplete={saveSongAfterUpload}
                            onUploadError={(error) => {
                                alert(`ERROR! ${error}`);
                            }}
                        />
                    </div>
                </div>
            )}
            {songId && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Upload Album Cover</h2>
                    <div className="mb-4">
                        <UploadDropzone
                            uploadUrl={generateUploadUrl}
                            fileTypes={{
                                "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                            }}
                            onUploadComplete={saveImageAfterUpload}
                            onUploadError={(error) => {
                                alert(`ERROR! ${error}`);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}