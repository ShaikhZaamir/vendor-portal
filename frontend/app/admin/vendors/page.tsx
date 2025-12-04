import { apiGet } from "@/lib/api";
import Link from "next/link";

export default async function AdminVendorsPage() {
    const data = await apiGet("/api/public/vendors-with-stats");

    const vendors = data.vendors || [];

    type VendorStats = {
        id: string;
        name: string;
        category: string;
        city: string;
        logo_url: string | null;
        average_rating: number | null;
        review_count: number | null;
    };


    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Panel — Vendor Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {vendors.map((vendor: VendorStats) => (
                    <div
                        key={vendor.id}
                        className="border rounded-lg p-4 shadow hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold">{vendor.name}</h2>

                        <p className="text-gray-600">{vendor.category}</p>
                        <p className="text-gray-600">{vendor.city}</p>

                        <p className="mt-2 font-medium">
                            ⭐ Average Rating: {vendor.average_rating ?? 0}
                        </p>

                        <p className="text-gray-700">
                            📝 Reviews: {vendor.review_count ?? 0}
                        </p>

                        <Link
                            href={`/vendor/${vendor.id}`}
                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            View Vendor
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
