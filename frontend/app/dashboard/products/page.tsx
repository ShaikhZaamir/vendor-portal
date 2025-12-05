"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

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

            const data = await apiGet("/api/vendor/products", token);
            setProducts(data.products || []);
            setLoading(false);
        };

        load();
    }, []);

    if (authFail) {
        return (
            <div className="p-6">
                <p className="text-gray-700">You are not logged in.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-6">Loading your products...</div>;
    }

    return (
        <div className="mx-auto p-6 space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-900">Your Products</h1>

                <Link href="/dashboard/products/add" className="w-48">
                    <Button>Add Product</Button>
                </Link>
            </div>

            {/* EMPTY STATE */}
            {products.length === 0 && (
                <p className="text-gray-600 mt-4">No products added yet.</p>
            )}

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        {/* Product Image */}
                        {p.image_url ? (
                            <Image
                                src={p.image_url}
                                alt={p.name}
                                width={260}
                                height={260}
                                className="rounded-md object-contain w-full h-48 mb-4"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Product Title */}
                        <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>

                        {/* Description */}
                        {p.description && (
                            <p className="text-gray-700 mt-1 text-sm line-clamp-2">
                                {p.description}
                            </p>
                        )}

                        {/* Price */}
                        <div className="mt-3 font-medium text-gray-900">
                            {p.min_price || p.max_price ? (
                                <>₹ {p.min_price ?? p.price} – {p.max_price ?? p.price}</>
                            ) : p.price ? (
                                <>₹ {p.price}</>
                            ) : (
                                <span className="text-gray-500 text-sm">No price specified</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-5">
                            <Link href={`/dashboard/products/${p.id}/edit`} className="flex-1">
                                <Button variant="secondary" className="py-2">
                                    Edit
                                </Button>
                            </Link>

                            <Button
                                variant="danger"
                                className="flex-1 py-2"
                                onClick={async () => {
                                    const token = getToken();
                                    if (!token) return;

                                    if (confirm("Delete this product?")) {
                                        await apiDelete(`/api/vendor/products/${p.id}`, token ?? undefined);
                                        setProducts((prev) => prev.filter((x) => x.id !== p.id));
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
