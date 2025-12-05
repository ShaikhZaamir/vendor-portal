"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

type LoginErrors = {
    email?: string;
    password?: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<LoginErrors>({});

    function validateForm() {
        const newErrors: LoginErrors = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!email.includes("@")) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) return;

        const res = await apiPost("/api/auth/login", { email, password });

        if (res.token) {
            saveToken(res.token);
            router.push("/dashboard");
        } else {
            alert(res.error || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Vendor Login
                </h1>

                <form onSubmit={handleLogin} noValidate className="space-y-4">
                    <FormField label="Email" required error={errors.email}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormField>

                    <FormField label="Password" required error={errors.password}>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormField>

                    <Button type="submit">Login</Button>

                    <div className="text-center pt-2">
                        <a
                            href="/register"
                            className="text-blue-600 hover:text-blue-700 underline text-sm"
                        >
                            Create an account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
