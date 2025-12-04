"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

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

    function updateField(field: keyof RegisterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Frontend validation
        if (!/^[0-9]{10}$/.test(form.contact)) {
            alert("Enter a valid 10-digit contact number");
            return;
        }

        if (form.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if (form.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // SEND AS JSON (NOT FormData)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                logo_url: logo || null,   // ← send Cloudinary URL here
            }),
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // Show success popup
        setShowSuccess(true);
    }

    return (
        <div className="max-w-lg mx-auto p-6 relative">
            <h1 className="text-3xl font-bold mb-6">Vendor Registration</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">Vendor Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Owner Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.owner_name}
                        onChange={(e) => updateField("owner_name", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Contact Number</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.contact}
                        onChange={(e) => updateField("contact", e.target.value)}
                        required
                    />
                </div>

                {/* CATEGORY DROPDOWN */}
                <div>
                    <label className="block mb-1 font-medium">Business Category</label>
                    <select
                        className="w-full border p-2 rounded"
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
                </div>

                <div>
                    <label className="block mb-1 font-medium">City</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={3}
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* LOGO UPLOAD */}
                <div>
                    <label className="block mb-1 font-medium">Company Logo (optional)</label>
                    <ImageUploader
                        folder="vendor-logos"
                        label="Upload Company Logo"
                        onUpload={(url) => {
                            setLogo(url);
                        }}
                    />

                    {logo && (
                        <Image
                            src={logo}
                            alt="Vendor Logo"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>

            {/* SUCCESS POPUP MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">
                            Registration Successful
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Your vendor account has been created successfully.
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}