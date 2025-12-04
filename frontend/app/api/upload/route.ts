// /app/api/upload/route.ts
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
// Otherwise use a relative import (uncomment and adjust):
// import cloudinary from "../../../lib/cloudinary";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder")?.toString() || "vender-images";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File -> Buffer (Node runtime)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              public_id: uuid(),
              resource_type: "image",
            },
            // typed callback: error could be any, result will be Cloudinary response
            (error: unknown, result: unknown) => {
              if (error) return reject(error);
              // Do runtime checks and cast safely
              const r = result as Record<string, unknown> | undefined;
              if (!r || typeof r.secure_url !== "string" || typeof r.public_id !== "string") {
                return reject(new Error("Unexpected Cloudinary response"));
              }
              resolve({
                secure_url: r.secure_url as string,
                public_id: r.public_id as string,
              });
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: String(error) },
      { status: 500 }
    );
  }
}
