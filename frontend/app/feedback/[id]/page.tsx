export const dynamic = "force-dynamic";

import { apiPost } from "@/lib/api";
import { redirect } from "next/navigation";

export default function FeedbackPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Since params is a promise in Next.js 16:
    async function handleSubmit(formData: FormData) {
        "use server";

        const { id } = await params;

        const client_name = formData.get("client_name") as string;
        const project = formData.get("project") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;

        await apiPost(`/api/public/vendor/${id}/reviews`, {
            client_name,
            project,
            rating,
            comment,
        });

        // After submitting review, redirect back to vendor page
        redirect(`/vendor/${id}`);
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Leave Feedback</h1>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Client Name</label>
                    <input
                        type="text"
                        name="client_name"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Project Name</label>
                    <input
                        type="text"
                        name="project"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Rating (1–5)</label>
                    <select
                        name="rating"
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select rating</option>
                        <option value="1">1 - Very Bad</option>
                        <option value="2">2 - Bad</option>
                        <option value="3">3 - Okay</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Comments</label>
                    <textarea
                        name="comment"
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}
