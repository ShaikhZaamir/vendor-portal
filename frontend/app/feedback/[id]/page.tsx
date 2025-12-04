export const dynamic = "force-dynamic";

import { apiPost } from "@/lib/api";
import { redirect } from "next/navigation";
import StarRating from "./StarRating";

export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    async function handleSubmit(formData: FormData) {
        "use server";

        const client_name = formData.get("client_name") as string;
        const project = formData.get("project") as string;
        const comments = formData.get("comments") as string;
        const rating = Number(formData.get("rating"));

        await apiPost(`/api/public/vendor/${id}/reviews`, {
            client_name,
            project,
            rating,
            comments,
        });

        redirect(`/vendor/${id}`);
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Leave Feedback</h1>

            <form action={handleSubmit} className="space-y-5">
                {/* CLIENT NAME */}
                <div>
                    <label className="block mb-1 font-medium">Client Name</label>
                    <input
                        type="text"
                        name="client_name"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* PROJECT NAME */}
                <div>
                    <label className="block mb-1 font-medium">Project Name (optional)</label>
                    <input
                        type="text"
                        name="project"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* STAR RATING (client component) */}
                <div>
                    <label className="block mb-1 font-medium">Rating</label>
                    <StarRating />
                </div>

                {/* COMMENTS */}
                <div>
                    <label className="block mb-1 font-medium">Comments</label>
                    <textarea
                        name="comments"
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                {/* SUBMIT */}
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
