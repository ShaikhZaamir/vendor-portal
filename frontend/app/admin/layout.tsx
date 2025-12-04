"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const navItems = [
    { name: "Vendors", href: "/admin/vendors" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* SIDEBAR */}
            <aside className="w-60 border-r bg-white p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Admin Panel</h2>

                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
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
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10">
                {children}
            </main>

        </div>
    );
}
