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
import { toast } from "sonner";
import BackButton from "@/components/ui/BackButton";

export default function AddProductPage() {
    const router = useRouter();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
    });

    function update(field: string, value: string) {
        setProduct((prev) => ({ ...prev, [field]: value }));
    }

    const isFormValid =
        product.name.trim() !== "" &&
        product.price.trim() !== "" &&
        Number(product.price) > 0 &&
        product.image_url.trim() !== "";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            toast.error("Not authorized");
            return;
        }

        if (!product.price || Number(product.price) <= 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        if (!product.image_url) {
            toast.error("Please upload a product image.");
            return;
        }

        await apiPost(
            "/api/vendor/products",
            {
                name: product.name,
                description: product.description,
                price: Number(product.price),
                image_url: product.image_url,
            },
            token
        );

        toast.success("Product added successfully!", {
            description: "Your product has been added to your product list.",
        });

        router.push("/dashboard/products");
    }

    return (
        <div>
            <div className="mx-auto p-6">
                <BackButton className="max-w-24 mb-3" />

                <h1 className="text-3xl font-semibold mb-6 text-gray-900">
                    Add Product
                </h1>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* TWO COLUMN GRID */}
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

                                <FormField label="Price (₹)" required>
                                    <Input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => update("price", e.target.value)}
                                        required
                                    />
                                </FormField>

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
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-4">
                                <FormField label="Product Image (required)">
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

                        <div className="flex justify-center pt-2">
                            <div className="w-48">
                                <Button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    Add Product
                                </Button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
