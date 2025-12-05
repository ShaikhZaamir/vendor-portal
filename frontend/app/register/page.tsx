"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

type RegisterForm = {
    name: string;
    owner_name: string;
    email: string;
    contact: string;
    category: string;
    city: string;
    description: string;
    password: string;
};

type RegisterErrors = {
    name?: string;
    owner_name?: string;
    email?: string;
    contact?: string;
    category?: string;
    city?: string;
    description?: string;
    password?: string;
    confirmPassword?: string;
};

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState<RegisterForm>({
        name: "",
        owner_name: "",
        email: "",
        contact: "",
        category: "",
        city: "",
        description: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [logo, setLogo] = useState<string>("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({});

    function updateField(field: keyof RegisterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function validateForm() {
        const newErrors: RegisterErrors = {};

        if (!form.name) newErrors.name = "Vendor name is required.";
        if (!form.owner_name) newErrors.owner_name = "Owner name is required.";

        if (!form.email) newErrors.email = "Email is required.";
        else if (!form.email.includes("@"))
            newErrors.email = "Enter a valid email.";

        if (!form.contact) newErrors.contact = "Contact number is required.";
        else if (!/^[0-9]{10}$/.test(form.contact))
            newErrors.contact = "Enter a valid 10-digit number.";

        if (!form.category) newErrors.category = "Category is required.";

        if (!form.city) newErrors.city = "City is required.";

        if (!form.description)
            newErrors.description = "Description is required.";

        if (!form.password) newErrors.password = "Password is required.";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (!confirmPassword)
            newErrors.confirmPassword = "Please confirm your password.";
        else if (form.password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, logo_url: logo || null }),
            }
        );

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        setShowSuccess(true);
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full mx-10 bg-white border border-gray-200 rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Vendor Registration
                </h1>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">

                    {/* Two-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-15">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            <FormField label="Vendor Name" required error={errors.name}>
                                <Input
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField label="Owner Name" required error={errors.owner_name}>
                                <Input
                                    value={form.owner_name}
                                    onChange={(e) => updateField("owner_name", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField label="Email" required error={errors.email}>
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField label="Contact Number" required error={errors.contact}>
                                <Input
                                    value={form.contact}
                                    onChange={(e) => updateField("contact", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Business Category"
                                required
                                error={errors.category}
                            >
                                <select
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                                    value={form.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option>Contractor</option>
                                    <option>Material Supplier</option>
                                    <option>Consultant</option>
                                    <option>Fabricator</option>
                                    <option>Labour Contractor</option>
                                    <option>Interior Designer</option>
                                    <option>Architect</option>
                                    <option>Other</option>
                                </select>
                            </FormField>

                            <FormField label="City" required error={errors.city}>
                                <Input
                                    value={form.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    required
                                />
                            </FormField>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">

                            <FormField label="Upload Company Logo">
                                <ImageUploader
                                    folder="vendor-logos"
                                    label=""
                                    onUpload={(url) => setLogo(url)}
                                />

                                {logo && (
                                    <Image
                                        src={logo}
                                        alt="Vendor Logo"
                                        width={90}
                                        height={90}
                                        className="rounded-full mt-2 cursor-pointer"
                                    />
                                )}
                            </FormField>

                            <FormField label="Description" required error={errors.description}>
                                <textarea
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    required
                                ></textarea>
                            </FormField>

                            <FormField label="Password" required error={errors.password}>
                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Confirm Password"
                                required
                                error={errors.confirmPassword}
                            >
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Centered Register button */}
                    <div className="flex justify-center pt-4">
                        <div className="w-48">
                            <Button type="submit">Register</Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">
                            Registration Successful
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Your vendor account has been created successfully.
                        </p>

                        <Button onClick={() => router.push("/login")}>Go to Login</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
