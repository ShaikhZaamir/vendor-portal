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
            <label className="text-sm font-medium">{label}</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {loading && (
                <p className="text-xs text-gray-500">Uploading...</p>
            )}
        </div>
    );
}
