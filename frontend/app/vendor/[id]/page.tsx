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
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* VENDOR HEADER */}
      <div className="flex items-start gap-6">
        {/* LOGO */}
        {vendor.logo_url ? (
          <Image
            src={vendor.logo_url}
            alt="Vendor Logo"
            width={120}
            height={120}
            className="rounded-lg border shadow-sm object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
            No Logo
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-gray-700 text-lg">{vendor.category}</p>
          <p className="text-gray-600">{vendor.city}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg">{vendor.average_rating ?? 0}</span>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      {vendor.description && (
        <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
      )}

      <Link
        href={`/feedback/${vendor.id}`}
        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Give Feedback
      </Link>

      {/* PRODUCTS SECTION */}
      <div>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Products</h2>

        {/* Empty State */}
        {(!vendor.products || vendor.products.length === 0) && (
          <p className="text-gray-600">No products added yet.</p>
        )}

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vendor.products.map((prod) => (
            <div
              key={prod.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              {/* PRODUCT IMAGE */}
              {prod.image_url ? (
                <Image
                  src={prod.image_url}
                  alt={prod.name}
                  width={300}
                  height={200}
                  className="rounded-md object-cover mb-3"
                />
              ) : (
                <div className="w-full rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mb-3">
                  No Image
                </div>
              )}

              {/* NAME */}
              <h3 className="text-lg font-semibold">{prod.name}</h3>

              {/* DESCRIPTION */}
              {prod.description && (
                <p className="text-gray-700 mt-1">{prod.description}</p>
              )}

              {/* PRICE RANGE */}
              {prod.min_price || prod.max_price ? (
                <p className="mt-2 font-medium">
                  ₹ {prod.min_price ?? prod.price} – {prod.max_price ?? prod.price}
                </p>
              ) : prod.price ? (
                <p className="mt-2 font-medium">₹ {prod.price}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
