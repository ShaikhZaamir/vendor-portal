"use client";

import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Product = {
    id: string;
    name: string;
    description: string | null;
    price?: number | null;
    min_price?: number | null;
    max_price?: number | null;
    image_url?: string | null;
};

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [authFail, setAuthFail] = useState(false);

    useEffect(() => {
        const load = async () => {
            const token = getToken();

            if (!token) {
                setAuthFail(true);
                setLoading(false);
                return;
            }

            // 2️⃣ FETCH PRODUCTS
            const data = await apiGet("/api/vendor/products", token);
            setProducts(data.products || []);
            setLoading(false);
        };

        // Start async flow
        load();
    }, []);


    // SHOW NOT LOGGED IN SCREEN
    if (authFail) {
        return (
            <div className="p-6">
                <p className="text-gray-700">You are not logged in.</p>
            </div>
        );
    }

    // SHOW LOADING
    if (loading) {
        return <div className="p-6">Loading your products...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Your Products</h1>

                <Link
                    href="/dashboard/products/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Add Product
                </Link>
            </div>

            {/* EMPTY STATE */}
            {products.length === 0 && (
                <p className="text-gray-600">No products added yet.</p>
            )}

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                        {p.image_url ? (
                            <Image
                                src={p.image_url}
                                alt={p.name}
                                width={300}
                                height={180}
                                className="rounded-md object-cover mb-4"
                            />
                        ) : (
                            <div className="w-full h-[150px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mb-4">
                                No Image
                            </div>
                        )}

                        <h2 className="text-lg font-semibold">{p.name}</h2>

                        {p.description && (
                            <p className="text-gray-700 mt-1">{p.description}</p>
                        )}

                        {p.min_price || p.max_price ? (
                            <p className="font-medium mt-2">
                                ₹ {p.min_price ?? p.price} - {p.max_price ?? p.price}
                            </p>
                        ) : p.price ? (
                            <p className="font-medium mt-2">₹ {p.price}</p>
                        ) : (
                            <p className="text-gray-600 mt-2">No price specified</p>
                        )}

                        <div className="flex gap-3 mt-4">
                            <Link
                                href={`/dashboard/products/${p.id}/edit`}
                                className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={async () => {
                                    const token = getToken();
                                    if (!token) return;

                                    if (confirm("Delete this product?")) {
                                        await apiDelete(`/api/vendor/products/${p.id}`, token ?? undefined);
                                        setProducts((prev) => prev.filter((x) => x.id !== p.id));
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
