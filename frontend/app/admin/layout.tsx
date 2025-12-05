"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList } from "lucide-react";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const navItems = [
    { name: "Vendors", href: "/admin/vendors", icon: LayoutList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between shadow-md">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">
                        Admin Panel
                    </h2>

                    <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition font-medium",
                                        pathname === item.href
                                            ? "bg-blue-50 border border-blue-200 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-200"
                                    )}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}
