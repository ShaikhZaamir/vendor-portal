"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

export default function AddProductPage() {
    const router = useRouter();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        min_price: "",
        max_price: "",
        image_url: "",
    });

    const [showSuccess, setShowSuccess] = useState(false);

    function update(field: string, value: string) {
        setProduct((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token) return alert("Not authorized");

        // If price is optional, ensure at least one price field is filled
        if (!product.min_price && !product.max_price) {
            alert("Please provide at least one price value (min or max).");
            return;
        }

        // If both prices exist → max must be greater than min
        if (product.min_price && product.max_price) {
            const min = Number(product.min_price);
            const max = Number(product.max_price);

            if (max < min) {
                alert("Max price must be greater than Min price.");
                return;
            }
        }

        await apiPost(
            "/api/vendor/products",
            {
                name: product.name,
                description: product.description,
                min_price: product.min_price ? Number(product.min_price) : null,
                max_price: product.max_price ? Number(product.max_price) : null,
                image_url: product.image_url || null,
            },
            token
        );

        setShowSuccess(true);
    }

    return (
        <div className="max-w-lg mx-auto p-6 relative">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* NAME */}
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={product.name}
                        onChange={(e) => update("name", e.target.value)}
                        required
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="block mb-1 font-medium">Short Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={4}
                        value={product.description}
                        onChange={(e) => update("description", e.target.value)}
                    ></textarea>
                </div>

                {/* PRICE RANGE */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Min Price</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={product.min_price}
                            onChange={(e) => update("min_price", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Max Price</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={product.max_price}
                            onChange={(e) => update("max_price", e.target.value)}
                        />
                    </div>
                </div>

                {/* IMAGE URL (TEMPORARY UNTIL REAL UPLOAD) */}
                <div>
                    <label className="block mb-1 font-medium">Product Image URL</label>
                    {/* PRODUCT IMAGE */}
                    <div>
                        <label className="block mb-1 font-medium">Product Image</label>

                        <ImageUploader
                            onUpload={(url) => update("image_url", url)}
                        />

                        {product.image_url && (
                            <Image
                                src={product.image_url}
                                alt={product.name || "Product Image"}
                                width={128}
                                height={128}
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}

                    </div>

                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Add Product
                </button>
            </form>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2">Product Added</h2>
                        <p className="text-gray-600 mb-6">
                            Your product has been added successfully.
                        </p>

                        <button
                            onClick={() => router.push("/dashboard/products")}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Go to Product List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
