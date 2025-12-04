"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating() {
    const [rating, setRating] = useState(0);

    return (
        <>
            <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-7 h-7 cursor-pointer ${rating >= s ? "text-yellow-500" : "text-gray-400"
                            }`}
                        onClick={() => setRating(s)}
                    />
                ))}
            </div>

            {/* Hidden input for form POST */}
            <input type="hidden" name="rating" value={rating} required />
        </>
    );
}
