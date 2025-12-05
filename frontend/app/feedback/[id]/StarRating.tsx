"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating() {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    return (
        <>
            <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`
              w-6 h-6 cursor-pointer transition-all duration-150
              ${hovered >= s || rating >= s ? "text-yellow-300 fill-yellow-300" : "text-gray-300"}
              hover:scale-110
            `}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(s)}
                    />
                ))}
            </div>

            {/* hidden field for server action submission */}
            <input type="hidden" name="rating" value={rating} required />
        </>
    );
}
