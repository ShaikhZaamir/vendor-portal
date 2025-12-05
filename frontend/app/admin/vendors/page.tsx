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
        <div className="max-w-5xl mx-auto p-3">
            {/* PAGE HEADER */}
            <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                Vendor Overview
            </h1>

            {/* TABLE CARD */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-md">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-700 text-sm">
                            <th className="px-6 py-4 font-medium text-left">Vendor Name</th>
                            <th className="px-6 py-4 font-medium text-left">Category</th>
                            <th className="px-6 py-4 font-medium text-left">Rating</th>
                            <th className="px-6 py-4 font-medium text-left">Reviews</th>
                            <th className="px-6 py-4 font-medium text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vendors.map((vendor: VendorStats, index: number) => (
                            <tr
                                key={vendor.id}
                                className=" transition hover:bg-gray-50">
                                <td className="px-6 py-4 border-t border-gray-100">{vendor.name}</td>
                                <td className="px-6 py-4 border-t border-gray-100">{vendor.category}</td>
                                <td className="px-6 py-4 border-t border-gray-100">{vendor.average_rating ?? 0}</td>
                                <td className="px-6 py-4 border-t border-gray-100">{vendor.review_count ?? 0}</td>

                                <td className="px-6 py-4 border-t border-gray-100 text-center">
                                    <Link
                                        href={`/vendor/${vendor.id}`}
                                        className="
                inline-block px-4 py-2 rounded-md text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700 transition
              "
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {vendors.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-100"
                                >
                                    No vendors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
