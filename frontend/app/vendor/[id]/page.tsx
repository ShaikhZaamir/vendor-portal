import { apiGet } from "@/lib/api";
import { Star } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url?: string | null;
};

type Vendor = {
  id: string;
  name: string;
  owner_name: string;
  category: string;
  city: string;
  description: string | null;
  logo_url: string | null;
  average_rating: number;
  products: Product[];
};

export default async function VendorProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const vendorResponse = await apiGet(`/api/public/vendor/${id}`);
  console.log("VENDOR RESPONSE >>>", vendorResponse);

  if (
    !vendorResponse ||
    (typeof vendorResponse === "object" &&
      vendorResponse !== null &&
      "error" in vendorResponse)
  ) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl text-red-600">Vendor not found</h1>
      </div>
    );
  }

  const vendor = vendorResponse as Vendor;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{vendor.name}</h1>

      <p className="text-gray-700 text-lg">{vendor.category}</p>
      <p className="text-gray-600">{vendor.city}</p>

      <div className="flex items-center gap-1 mt-2">
        <Star className="w-5 h-5 text-yellow-500" />
        <span className="text-lg">{vendor.average_rating ?? 0}</span>
      </div>

      {vendor.description && (
        <p className="mt-4 text-gray-700">{vendor.description}</p>
      )}

      <Link
        href={`/feedback/${vendor.id}`}
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Give Feedback
      </Link>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Products</h2>

      {!vendor.products || vendor.products.length === 0 ? (
        <p className="text-gray-600">No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendor.products.map((prod) => (
            <div key={prod.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold">{prod.name}</h3>
              <p className="text-gray-600">{prod.description}</p>
              {prod.price && <p className="mt-2 font-medium">₹ {prod.price}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
