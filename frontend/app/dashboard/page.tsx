"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Vendor = {
    id: string;
    name: string;
    owner_name: string;
    email: string;
    contact: string;
    category: string;
    city: string;
    description?: string;
    logo_url?: string;
};

export default function VendorDashboard() {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("vendor_token");
        if (!token) {
            router.push("/login");
            return;
        }

        async function loadProfile() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            setVendor(data.vendor ?? data ?? null);
            setLoading(false);
        }

        loadProfile();
    }, [router]);

    if (loading) return <p>Loading...</p>;
    if (!vendor) return <p>No vendor data found.</p>;

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome, {vendor.name}</p>
            </div>

            {/* PROFILE SUMMARY */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                {/* Top section: Logo + Name */}
                <div className="flex items-start gap-8 mb-6">
                    {vendor.logo_url ? (
                        <Image
                            src={vendor.logo_url}
                            alt="Logo"
                            width={90}
                            height={90}
                            className="rounded-lg border border-gray-200 shadow-sm"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            No Logo
                        </div>
                    )}

                    <div className="space-y-1"  >
                        <h2 className="text-2xl font-semibold text-gray-900">{vendor.name}</h2>
                        <p className="text-gray-600 text-sm">{vendor.category}</p>
                        <p className="text-gray-500 text-sm">{vendor.city}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                    <p><strong className="text-gray-800">Owner:</strong> {vendor.owner_name}</p>
                    <p><strong className="text-gray-800">Email:</strong> {vendor.email}</p>
                    <p><strong className="text-gray-800">Contact:</strong> {vendor.contact}</p>
                    <p><strong className="text-gray-800">Category:</strong> {vendor.category}</p>
                    <p><strong className="text-gray-800">City:</strong> {vendor.city}</p>
                </div>

                {/* Description */}
                {vendor.description && (
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        {vendor.description}
                    </p>
                )}

                {/* Edit Button */}
                <div className="mt-6 w-44">
                    <Button onClick={() => router.push("/dashboard/profile")}>
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* PRODUCT MANAGEMENT */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Products</h2>
                <p className="text-gray-600 mb-4">Manage your products.</p>

                <div className="w-fit">
                    <Button variant="secondary" onClick={() => router.push("/dashboard/products")}>
                        Go to Product Management
                    </Button>
                </div>
            </div>

        </div>
    );
}
