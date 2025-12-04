export const dynamic = "force-dynamic";

import { apiGet } from "@/lib/api";
import Link from "next/link";

interface VendorStats {
    id: string;
    name: string;
    category: string;
    average_rating: number | null;
    review_count: number | null;
}


export default async function AdminVendorsPage() {
    const data = await apiGet("/api/public/vendors-with-stats");
    const vendors = data.vendors || [];

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6 text-gray-900">Admin Panel — Vendor Overview</h1>

            <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full text-left text-gray-900">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 font-medium">Vendor Name</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Rating</th>
                            <th className="px-4 py-3 font-medium">Reviews</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vendors.map((vendor: VendorStats) => (
                            <tr key={vendor.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-4 py-3">{vendor.name}</td>
                                <td className="px-4 py-3">{vendor.category}</td>
                                <td className="px-4 py-3">{vendor.average_rating ?? 0}</td>
                                <td className="px-4 py-3">{vendor.review_count ?? 0}</td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/vendor/${vendor.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Vendor
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
