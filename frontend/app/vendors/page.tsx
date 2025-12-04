import { apiGet } from "@/lib/api";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function VendorsPage() {
    const data = await apiGet("/api/public/vendors");
    const vendors = data.vendors || [];

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Vendors</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vendors.map((vendor: any) => (
                    <div
                        key={vendor.id}
                        className="border rounded-lg p-4 shadow hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold">{vendor.name}</h2>
                        <p className="text-gray-600">{vendor.category}</p>
                        <p className="text-gray-600">{vendor.city}</p>

                        <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{vendor.average_rating || 0}</span>
                        </div>

                        <Link
                            href={`/vendor/${vendor.id}`}
                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            View Profile
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
