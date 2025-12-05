"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Star } from "lucide-react";

type Vendor = {
    id: string;
    name: string;
    category: string;
    city: string;
    logo_url: string | null;
    average_rating: number | null;
};

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [filtered, setFiltered] = useState<Vendor[]>([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");

    useEffect(() => {
        async function load() {
            const data = await apiGet("/api/public/vendors");
            const v = data.vendors || [];
            setVendors(v);
            setFiltered(v);
        }
        load();
    }, []);

    useEffect(() => {
        let result = [...vendors];

        if (search.trim() !== "") {
            result = result.filter((v) =>
                v.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "") {
            result = result.filter((v) => v.category === category);
        }

        if (sort === "high") {
            result = result.sort(
                (a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0)
            );
        } else if (sort === "low") {
            result = result.sort(
                (a, b) => (a.average_rating ?? 0) - (b.average_rating ?? 0)
            );
        }

        setFiltered(result);
    }, [search, category, sort, vendors]);

    return (
        <div className="mx-auto p-6">

            {/* TOP ACTION BAR */}
            <div className="flex justify-end gap-4 mb-6">
                <Link href="/login" className="w-36">
                    <Button variant="secondary">Vendor Login</Button>
                </Link>

                <Link href="/admin/vendors" className="w-36">
                    <Button variant="primary">Admin Panel</Button>
                </Link>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">Vendors</h1>

            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col sm:flex-row gap-4">

                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="
              bg-white border border-gray-300 rounded-md px-4 py-2
              w-full sm:w-1/3 outline-none
              focus:border-blue-600 focus:ring-2 focus:ring-blue-200
            "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="
              bg-white border border-gray-300 rounded-md px-4 py-2
              w-full sm:w-1/3 outline-none
              focus:border-blue-600 focus:ring-2 focus:ring-blue-200
            "
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option>Contractor</option>
                        <option>Material Supplier</option>
                        <option>Consultant</option>
                        <option>Fabricator</option>
                        <option>Labour Contractor</option>
                        <option>Interior Designer</option>
                        <option>Architect</option>
                        <option>Other</option>
                    </select>

                    <select
                        className="
              bg-white border border-gray-300 rounded-md px-4 py-2
              w-full sm:w-1/3 outline-none
              focus:border-blue-600 focus:ring-2 focus:ring-blue-200
            "
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort by Rating</option>
                        <option value="high">High to Low</option>
                        <option value="low">Low to High</option>
                    </select>

                </div>
            </div>

            {/* VENDOR GRID */}
            <div className="grid grid-cols- sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filtered.map((vendor) => (
                    <div
                        key={vendor.id}
                        className="
        bg-white p-5 rounded-xl border border-gray-100 shadow-sm 
        hover:shadow-md transition cursor-pointer 
        flex flex-col h-full
    "
                    >

                        {/* FIXED SIZE LOGO */}
                        <div className="w-full flex justify-center mb-4">
                            {vendor.logo_url ? (
                                <Image
                                    src={vendor.logo_url}
                                    alt="Vendor Logo"
                                    width={100}
                                    height={100}
                                    className="rounded-lg object-cover w-24 h-24"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                    No Logo
                                </div>
                            )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col flex-grow">
                            <h2 className="text-xl font-semibold text-gray-900">{vendor.name}</h2>
                            <p className="text-gray-700 text-sm">{vendor.category}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mt-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-800">{vendor.average_rating ?? 0}</span>
                            </div>

                            {/* PUSH BUTTON TO BOTTOM */}
                            <div className="mt-auto">
                                <Link
                                    href={`/vendor/${vendor.id}`}
                                    className="
                    inline-block mt-5 w-full
                    bg-blue-600 text-white py-2 rounded-md 
                    hover:bg-blue-700 transition text-center font-medium
                "
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
