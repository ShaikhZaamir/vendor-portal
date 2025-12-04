"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
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

    // Load vendors
    useEffect(() => {
        async function load() {
            const data = await apiGet("/api/public/vendors");
            const v = data.vendors || [];
            setVendors(v);
            setFiltered(v); // initial list
        }
        load();
    }, []);

    // Apply filtering / sorting
    useEffect(() => {
        async function applyFilters() {
            let result = [...vendors];

            // SEARCH by name
            if (search.trim() !== "") {
                result = result.filter((v) =>
                    v.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            // FILTER by category
            if (category !== "") {
                result = result.filter((v) => v.category === category);
            }

            // SORT by rating
            if (sort === "high") {
                result = result.sort(
                    (a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0)
                );
            } else if (sort === "low") {
                result = result.sort(
                    (a, b) => (a.average_rating ?? 0) - (b.average_rating ?? 0)
                );
            }

            setFiltered(result); // ✔ safe inside async function
        }

        applyFilters();
    }, [search, category, sort, vendors]);


    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Vendors</h1>

            {/* FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border p-2 rounded w-full sm:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded w-full sm:w-1/3"
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
                    className="border p-2 rounded w-full sm:w-1/3"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort by Rating</option>
                    <option value="high">High to Low</option>
                    <option value="low">Low to High</option>
                </select>
            </div>

            {/* VENDOR GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((vendor) => (
                    <div
                        key={vendor.id}
                        className="border rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        {/* LOGO */}
                        {vendor.logo_url ? (
                            <Image
                                src={vendor.logo_url}
                                alt="Vendor Logo"
                                width={80}
                                height={80}
                                className="rounded-md object-cover mb-3"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500">
                                No Logo
                            </div>
                        )}
                        <h2 className="text-lg font-semibold">{vendor.name}</h2>
                        <p className="text-gray-700">{vendor.category}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{vendor.average_rating ?? 0}</span>
                        </div>

                        <Link
                            href={`/vendor/${vendor.id}`}
                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            View Profile
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
