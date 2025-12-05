import { apiGet } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  min_price?: number | null;
  max_price?: number | null;
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
  average_rating: number | null;
  products: Product[];
};

export default async function VendorProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const vendorResponse = await apiGet(`/api/public/vendor/${id}`);

  if (!vendorResponse || vendorResponse.error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl text-red-600">Vendor not found</h1>
      </div>
    );
  }

  const vendor = vendorResponse as Vendor;

  return (
    <div className="max-w-11/12 mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6">

        {vendor.logo_url ? (
          <Image
            src={vendor.logo_url}
            alt="Vendor Logo"
            width={150}
            height={150}
            className="rounded-xl object-contain shadow-sm"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
            No Logo
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>

          <div className="flex gap-3 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {vendor.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {vendor.city}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold">
              {vendor.average_rating ?? 0}
            </span>
          </div>
          {vendor.description && (
            <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl">
              {vendor.description}
            </p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}

      <Link
        href={`/feedback/${vendor.id}`}
        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
      >
        Give Feedback
      </Link>

      {/* PRODUCTS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        {vendor.products.length === 0 && (
          <div className="text-gray-600 bg-gray-50 rounded-xl p-6 text-center">
            No products added yet.
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">
          {vendor.products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
            >
              {prod.image_url ? (
                <Image
                  src={prod.image_url}
                  alt={prod.name}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover mb-3 h-40 w-full"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">{prod.name}</h3>

              {prod.description && (
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {prod.description}
                </p>
              )}

              <p className="mt-2 font-bold text-gray-800">
                {prod.min_price || prod.max_price
                  ? `₹${prod.min_price ?? prod.price} – ₹${prod.max_price ?? prod.price}`
                  : prod.price
                    ? `₹${prod.price}`
                    : "No price provided"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
