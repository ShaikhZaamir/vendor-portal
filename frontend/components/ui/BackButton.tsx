"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
    href,
    label = "Back",
    className = "",
}: {
    href?: string; 
    label?: string;
    className?: string;
}) {
    const router = useRouter();

    function handleClick() {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    }

    return (
        <Button
            variant="secondary"
            onClick={handleClick}
            className={`flex items-center gap-2 w-fit ${className}`}
        >
            <ArrowLeft size={16} />
            {label}
        </Button>
    );
}
