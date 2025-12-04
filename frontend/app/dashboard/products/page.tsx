"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
};

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            async function loadProducts() {
                const data = await apiGet("/api/vendor/products", token ?? undefined);

                setProducts(data.products || []);
                setLoading(false);
            }

            loadProducts();
        }, 10);
    }, []);

    async function deleteProduct(id: string) {
        const token = getToken();
        if (!token) return;

        await apiDelete(`/api/vendor/products/${id}`, token ?? undefined);

        setProducts((prev) => prev.filter((p) => p.id !== id));
    }

    if (loading) return <div className="p-6">Loading your products...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Your Products</h1>
                <Link
                    href="/dashboard/products/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-600">No products added yet.</p>
            ) : (
                <div className="space-y-4">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">{p.name}</h2>
                                <p>{p.description}</p>
                                <p className="font-medium mt-1">₹ {p.price}</p>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/dashboard/products/${p.id}/edit`}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
