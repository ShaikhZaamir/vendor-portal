"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Edit Profile", href: "/dashboard/profile" },
    { name: "Products", href: "/dashboard/products" },
];

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("vendor_token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* SIDEBAR */}
            <aside className="w-60 border-r bg-white p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Vendor Panel</h2>

                    <nav className="flex flex-col space-y-2">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition",
                                    pathname === item.href
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "text-gray-700"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={logout}
                    className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                >
                    Logout
                </button>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-10">{children}</main>
        </div>
    );
}
