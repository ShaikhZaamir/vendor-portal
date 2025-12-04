"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Vendor = {
    name: string;
    owner_name: string;
    contact: string;
    category: string;
    city: string;
    description: string;
    logo_url: string | null;
};

export default function EditProfilePage() {
    const router = useRouter();

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    // Load vendor profile
    useEffect(() => {
        setTimeout(() => {
            const finalToken = getToken();

            if (!finalToken) {
                setLoading(false);
                return;
            }

            async function loadVendor() {
                const data = await apiGet("/api/vendor/profile", finalToken ?? undefined);

                if (data && data.vendor) {
                    setVendor(data.vendor);
                }

                setLoading(false);
            }

            loadVendor();
        }, 10);
    }, []);


    if (loading) return <div className="p-6">Loading profile...</div>;
    if (!vendor) return <div className="p-6">Failed to load profile.</div>;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!vendor) return;

        const token = getToken();
        if (!token) return;

        await apiPut("/api/vendor/profile", vendor, token ?? undefined);

        alert("Profile updated successfully!");
        router.push("/dashboard");
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Vendor Name</label>
                    <input
                        type="text"
                        value={vendor.name}
                        onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Owner Name</label>
                    <input
                        type="text"
                        value={vendor.owner_name}
                        onChange={(e) =>
                            setVendor({ ...vendor, owner_name: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Contact</label>
                    <input
                        type="text"
                        value={vendor.contact}
                        onChange={(e) =>
                            setVendor({ ...vendor, contact: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <input
                        type="text"
                        value={vendor.category}
                        onChange={(e) =>
                            setVendor({ ...vendor, category: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">City</label>
                    <input
                        type="text"
                        value={vendor.city}
                        onChange={(e) => setVendor({ ...vendor, city: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        value={vendor.description}
                        onChange={(e) =>
                            setVendor({ ...vendor, description: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Logo URL (optional)</label>
                    IMG
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
