"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const router = useRouter();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token) return alert("Not authorized");

        await apiPost(
            "/api/vendor/products",
            {
                name: product.name,
                description: product.description,
                price: Number(product.price),
                image_url: product.image_url,
            },
            token ?? undefined
        );

        alert("Product added successfully!");
        router.push("/dashboard/products");
    }

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={product.name}
                        onChange={(e) =>
                            setProduct({ ...product, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={4}
                        value={product.description}
                        onChange={(e) =>
                            setProduct({ ...product, description: e.target.value })
                        }
                    ></textarea>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded"
                        value={product.price}
                        onChange={(e) =>
                            setProduct({ ...product, price: e.target.value })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Image URL</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={product.image_url}
                        onChange={(e) =>
                            setProduct({ ...product, image_url: e.target.value })
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
}
