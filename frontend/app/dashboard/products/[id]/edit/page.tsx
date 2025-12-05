"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ImageUploader from "@/components/ImageUploader";
import Image from "next/image";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

type Product = {
    name: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
};

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
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
                    price: data.product.price ?? null,
                    image_url: data.product.image_url,
                });
            }

            setLoading(false);
        })();
    }, [props.params]);

    if (loading) return <div className="p-6">Loading product...</div>;
    if (!product) return <div className="p-6">Product not found.</div>;

    const _product = product;

    const isFormValid =
        _product.name.trim() !== "" &&
        _product.price !== null &&
        Number(_product.price) > 0 &&
        _product.image_url?.trim() !== "";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token || !productId) return;

        if (!_product.price || Number(_product.price) <= 0) {
            toast.error("Invalid Price", {
                description: "Price must be a positive number.",
            });
            return;
        }

        if (!_product.image_url) {
            toast.error("Please upload a product image.");
            return;
        }

        await apiPut(
            `/api/vendor/products/${productId}`,
            {
                name: _product.name,
                description: _product.description,
                price: Number(_product.price),
                image_url: _product.image_url,
            },
            token
        );

        toast.success("Product updated successfully!", {
            description: "Your changes have been saved.",
        });

        router.push("/dashboard/products");
    }

    return (
        <div className="mx-auto relative">
            <BackButton className="max-w-24 mb-3" />

            <h1 className="text-3xl font-semibold mb-6 text-gray-900">Edit Product</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT SIDE */}
                        <div className="space-y-4">
                            <FormField label="Product Name" required>
                                <Input
                                    value={_product.name}
                                    onChange={(e) =>
                                        setProduct({ ...product, name: e.target.value })
                                    }
                                />
                            </FormField>

                            <FormField label="Price (₹)" required>
                                <Input
                                    type="number"
                                    value={_product.price ?? ""}
                                    onChange={(e) =>
                                        setProduct({ ...product, price: Number(e.target.value) })
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

                        {/* RIGHT SIDE */}
                        <div className="space-y-4">
                            <FormField label="Product Image (required)">
                                <ImageUploader
                                    folder="product-images"
                                    label=""
                                    onUpload={(url) =>
                                        setProduct({ ...product, image_url: url })
                                    }
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

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-center pt-2">
                        <div className="w-48">
                            <Button
                                type="submit"
                                disabled={!isFormValid}
                                className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
