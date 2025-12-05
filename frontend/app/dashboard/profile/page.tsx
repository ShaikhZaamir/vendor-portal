"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

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
    const [logo, setLogo] = useState<string>("");

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
                    setLogo(data.vendor.logo_url ?? "");
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

        await apiPut(
            "/api/vendor/profile",
            { ...vendor, logo_url: logo },
            token ?? undefined
        );

        alert("Profile updated successfully!");
        router.push("/dashboard");
    }

    return (
        <div className="mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">
                Edit Profile
            </h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* GRID: 2 COLUMNS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">

                            <FormField label="Vendor Name">
                                <Input
                                    value={vendor.name}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, name: e.target.value })
                                    }
                                />
                            </FormField>

                            <FormField label="Owner Name">
                                <Input
                                    value={vendor.owner_name}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, owner_name: e.target.value })
                                    }
                                />
                            </FormField>

                            <FormField label="Contact">
                                <Input
                                    value={vendor.contact}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, contact: e.target.value })
                                    }
                                />
                            </FormField>

                            <FormField label="Category">
                                <Input
                                    value={vendor.category}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, category: e.target.value })
                                    }
                                />
                            </FormField>

                            <FormField label="City">
                                <Input
                                    value={vendor.city}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, city: e.target.value })
                                    }
                                />
                            </FormField>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">

                            <FormField label="Description">
                                <textarea
                                    value={vendor.description}
                                    onChange={(e) =>
                                        setVendor({ ...vendor, description: e.target.value })
                                    }
                                    rows={4}
                                    className="
              w-full bg-white border border-gray-300 rounded-md px-4 py-3
              text-gray-800 outline-none focus:border-blue-600
              focus:ring-2 focus:ring-blue-200
            "
                                />
                            </FormField>

                            <FormField label="Company Logo (optional)">
                                <ImageUploader
                                    folder="vendor-logos"
                                    label=""
                                    onUpload={(url) => setLogo(url)}
                                />

                                {logo && (
                                    <Image
                                        src={logo}
                                        alt="Logo Preview"
                                        width={90}
                                        height={90}
                                        className="mt-3 rounded-lg border shadow-sm"
                                    />
                                )}
                            </FormField>

                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="pt-4 w-40 mx-auto">
                        <Button type="submit">Save Changes</Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
