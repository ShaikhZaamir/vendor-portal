"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import React from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Product = {
    name: string;
    description: string;
    price: number;
    image_url: string | null;
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params); 

    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            const finalToken = getToken();

            if (!finalToken) {
                setLoading(false);
                return;
            }

            async function loadProduct() {
                const data = await apiGet(
                    `/api/vendor/products/${id}`,
                    finalToken ?? undefined
                );

                if (data && data.product) {
                    setProduct(data.product);
                }

                setLoading(false);
            }

            loadProduct();
        }, 10);
    }, [id]);

    if (loading) return <div className="p-6">Loading product...</div>;
    if (!product) return <div className="p-6">Product not found.</div>;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token) return;

        await apiPut(
            `/api/vendor/products/${id}`,
            {
                name: product!.name,
                description: product!.description,
                price: Number(product!.price),
                image_url: product!.image_url,
            },
            token ?? undefined
        );

        alert("Product updated successfully!");
        router.push("/dashboard/products");
    }

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={product!.name}
                        onChange={(e) =>
                            setProduct({ ...product!, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={4}
                        value={product!.description}
                        onChange={(e) =>
                            setProduct({ ...product!, description: e.target.value })
                        }
                    ></textarea>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded"
                        value={product!.price}
                        onChange={(e) =>
                            setProduct({ ...product!, price: Number(e.target.value) })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Image URL</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={product!.image_url ?? ""}
                        onChange={(e) =>
                            setProduct({ ...product!, image_url: e.target.value })
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
