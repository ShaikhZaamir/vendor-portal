"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

type Product = {
    name: string;
    description: string | null;
    min_price?: number | null;
    max_price?: number | null;
    price?: number | null; // fallback for older data
    image_url: string | null;
};

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();

    // Correctly extract the ID
    const [productId, setProductId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { id } = await props.params;
            setProductId(id);

            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const data = await apiGet(`/api/vendor/products/${id}`, token);

            if (data?.product) {
                setProduct({
                    name: data.product.name,
                    description: data.product.description,
                    min_price: data.product.min_price ?? data.product.price ?? null,
                    max_price: data.product.max_price ?? null,
                    image_url: data.product.image_url,
                });
            }

            setLoading(false);
        })();
    }, [props.params]);

    if (loading) return <div className="p-6">Loading product...</div>;
    if (!product) return <div className="p-6">Product not found.</div>;

    const _product = product; // ✔ Now guaranteed non-null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token || !productId) return;

        // VALIDATE PRICE RANGE
        const min = _product.min_price ? Number(_product.min_price) : null;
        const max = _product.max_price ? Number(_product.max_price) : null;

        if (min && max && max < min) {
            alert("Max price must be greater than Min price.");
            return;
        }

        // API CALL
        await apiPut(
            `/api/vendor/products/${productId}`,
            {
                name: _product.name,
                description: _product.description,
                min_price: min,
                max_price: max,
                image_url: _product.image_url || null,
            },
            token
        );

        setShowSuccess(true);
    }

    return (
        <div className="max-w-lg mx-auto p-6 relative">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* PRODUCT NAME */}
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={_product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="block mb-1 font-medium">Short Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={4}
                        value={_product.description || ""}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    ></textarea>
                </div>

                {/* PRICE RANGE */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Min Price</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={_product.min_price ?? ""}
                            onChange={(e) =>
                                setProduct({ ...product, min_price: Number(e.target.value) })
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Max Price</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={product.max_price ?? ""}
                            onChange={(e) =>
                                setProduct({ ...product, max_price: Number(e.target.value) })
                            }
                        />
                    </div>
                </div>

                {/* IMAGE URL */}
                <div>
                    <label className="block mb-1 font-medium">Image URL (optional)</label>
                    {/* PRODUCT IMAGE UPLOAD */}
                    <div>
                        <label className="block mb-1 font-medium">Product Image</label>

                        <ImageUploader
                            onUpload={(url) => setProduct({ ...product, image_url: url })}
                        />

                        {product.image_url && (
                            <Image src={product.image_url} className="mt-2 w-32 h-32 object-cover rounded" />
                        )}
                    </div>

                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2">Product Updated</h2>
                        <p className="text-gray-600 mb-6">
                            Your product details have been updated successfully.
                        </p>

                        <button
                            onClick={() => router.push("/dashboard/products")}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Go Back to Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
