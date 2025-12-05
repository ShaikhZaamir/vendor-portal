"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

        if (!product.min_price && !product.max_price) {
            alert("Please provide at least one price value (min or max).");
            return;
        }

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
        <div className="max-w mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">Add Product</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">

                            <FormField label="Product Name" required>
                                <Input
                                    value={product.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField label="Min Price">
                                <Input
                                    type="number"
                                    value={product.min_price}
                                    onChange={(e) => update("min_price", e.target.value)}
                                />
                            </FormField>

                            <FormField label="Max Price">
                                <Input
                                    type="number"
                                    value={product.max_price}
                                    onChange={(e) => update("max_price", e.target.value)}
                                />
                            </FormField>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">

                            <FormField label="Short Description">
                                <textarea
                                    rows={4}
                                    value={product.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    className="
                    w-full bg-white border border-gray-300 rounded-md px-4 py-3
                    text-gray-800 outline-none focus:border-blue-600
                    focus:ring-2 focus:ring-blue-200
                  "
                                ></textarea>
                            </FormField>

                            <FormField label="Product Image">

                                <ImageUploader
                                    folder="product-images"
                                    label=""
                                    onUpload={(url) => update("image_url", url)}
                                />

                                {product.image_url && (
                                    <Image
                                        src={product.image_url}
                                        alt="Product Image"
                                        width={120}
                                        height={120}
                                        className="mt-3 w-32 h-32 object-cover rounded-lg border shadow-sm"
                                    />
                                )}

                            </FormField>

                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-2">
                        <div className="w-48">
                            <Button type="submit">Add Product</Button>
                        </div>
                    </div>

                </form>
            </div>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2">Product Added</h2>
                        <p className="text-gray-600 mb-6">
                            Your product has been added successfully.
                        </p>

                        <Button onClick={() => router.push("/dashboard/products")}>
                            Go to Product List
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
