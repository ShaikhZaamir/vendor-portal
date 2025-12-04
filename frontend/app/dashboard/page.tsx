"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Proper vendor type
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

            // Support both shapes: {vendor: {...}} or direct vendor object
            setVendor(data.vendor ?? data ?? null);
            setLoading(false);
        }

        loadProfile();
    }, [router]); // eslint fix

    if (loading) return <p>Loading...</p>;
    if (!vendor) return <p>No vendor data found.</p>;

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
                <p className="text-gray-600">Welcome, {vendor.name}</p>
            </div>

            {/* PROFILE SUMMARY */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p><strong>Name:</strong> {vendor.name}</p>
                    <p><strong>Owner:</strong> {vendor.owner_name}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Contact:</strong> {vendor.contact}</p>
                    <p><strong>Category:</strong> {vendor.category}</p>
                    <p><strong>City:</strong> {vendor.city}</p>
                </div>

                {vendor.description && (
                    <p className="mt-3"><strong>Description:</strong> {vendor.description}</p>
                )}

                {vendor.logo_url && (
                    <Image
                        src={vendor.logo_url}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="mt-4 border rounded"
                    />
                )}

                <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Edit Profile
                </button>
            </div>

            {/* PRODUCT MANAGEMENT */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <p className="text-gray-600 mb-4">Manage your products.</p>

                <button
                    onClick={() => router.push("/dashboard/products")}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
                >
                    Go to Product Management
                </button>
            </div>

        </div>
    );
}
