export const dynamic = "force-dynamic";

import { apiPost } from "@/lib/api";
import { redirect } from "next/navigation";

import StarRating from "./StarRating";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                Leave Feedback
            </h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <form action={handleSubmit} className="space-y-6">

                    {/* CLIENT NAME */}
                    <FormField label="Client Name" required>
                        <Input name="client_name" required />
                    </FormField>

                    {/* PROJECT NAME */}
                    <FormField label="Project Name (optional)">
                        <Input name="project" />
                    </FormField>

                    {/* RATING */}
                    <FormField label="Rating" required>
                        <StarRating />
                    </FormField>

                    {/* COMMENTS */}
                    <FormField label="Comments">
                        <textarea
                            name="comments"
                            rows={4}
                            className="
                w-full bg-white border border-gray-300 rounded-md px-4 py-3
                text-gray-800 outline-none focus:border-blue-600
                focus:ring-2 focus:ring-blue-200
              "
                        />
                    </FormField>

                    {/* SUBMIT */}
                    <div className="pt-3">
                        <Button type="submit">Submit Feedback</Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
