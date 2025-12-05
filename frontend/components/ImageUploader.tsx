"use client";

import { useState } from "react";

export default function ImageUploader({
    folder = "general",
    onUpload,
    label = "Choose Image",
}: {
    folder?: string;
    label?: string;
    onUpload: (url: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const upload = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        }).then((r) => r.json());

        if (upload.url) {
            onUpload(upload.url);
        }

        setLoading(false);
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <input
                id={`uploader-${folder}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            /> 

            <div
                onClick={() => document.getElementById(`uploader-${folder}`)?.click()}
                className="
        w-full py-8 px-4 border border-gray-300 rounded-lg bg-white
        flex flex-col items-center justify-center cursor-pointer
        hover:border-blue-500 hover:bg-blue-50 transition
      "
            >
                <span className="text-blue-600 font-medium text-sm">
                    Click to upload
                </span>
                <span className="text-xs text-gray-500 mt-1">JPG, PNG - up to 2MB</span>

                {loading && (
                    <span className="text-xs text-gray-500 mt-2 animate-pulse">
                        Uploading...
                    </span>
                )}
            </div>
        </div>
    );

}
