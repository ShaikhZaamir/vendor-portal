"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, Package } from "lucide-react";
import Button from "@/components/ui/Button";

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Edit Profile", href: "/dashboard/profile", icon: User },
    { name: "Products", href: "/dashboard/products", icon: Package },
];

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("vendor_token");
        router.push("/login");
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between shadow-md">
                <div>
                    <h2 className="text-xl font-semibold mb-8 text-gray-900">
                        Vendor Panel
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
                                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <Button
                    variant="danger"
                    onClick={logout}
                    className="flex items-center justify-center gap-2"
                >
                    <LogOut size={16} />
                    Logout
                </Button>

            </aside>

            {/* Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
