"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Product = {
    name: string;
    description: string | null;
    min_price?: number | null;
    max_price?: number | null;
    price?: number | null;
    image_url: string | null;
};

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
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

    const _product = product; // guaranteed non-null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token || !productId) return;

        // Price validation
        const min = _product.min_price ? Number(_product.min_price) : null;
        const max = _product.max_price ? Number(_product.max_price) : null;

        if (min && max && max < min) {
            alert("Max price must be greater than Min price.");
            return;
        }

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
        <div className="mx-auto p-6 relative">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">Edit Product</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            <FormField label="Product Name" required>
                                <Input
                                    value={_product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                            </FormField>

                            <FormField label="Min Price">
                                <Input
                                    type="number"
                                    value={_product.min_price ?? ""}
                                    onChange={(e) =>
                                        setProduct({ ...product, min_price: Number(e.target.value) })
                                    }
                                />
                            </FormField>

                            <FormField label="Max Price">
                                <Input
                                    type="number"
                                    value={_product.max_price ?? ""}
                                    onChange={(e) =>
                                        setProduct({ ...product, max_price: Number(e.target.value) })
                                    }
                                />
                            </FormField>
                            
                            <FormField label="Short Description">
                                <textarea
                                    rows={4}
                                    value={_product.description ?? ""}
                                    onChange={(e) =>
                                        setProduct({ ...product, description: e.target.value })
                                    }
                                    className="
                    w-full bg-white border border-gray-300 rounded-md px-4 py-3
                    text-gray-800 outline-none focus:border-blue-600
                    focus:ring-2 focus:ring-blue-200
                  "
                                />
                            </FormField>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">


                            <FormField label="Product Image">
                                <ImageUploader
                                    folder="product-images"
                                    label="Upload Product Image"
                                    onUpload={(url) => setProduct({ ...product, image_url: url })}
                                />

                                {product.image_url && (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name || "Product image"}
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
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </div>

                </form>
            </div>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2">Product Updated</h2>
                        <p className="text-gray-600 mb-6">
                            Your product details have been updated successfully.
                        </p>

                        <Button onClick={() => router.push("/dashboard/products")}>
                            Go Back to Products
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
