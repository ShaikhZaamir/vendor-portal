import React from "react";

type Variant = "primary" | "secondary" | "danger" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

export default function Button({
    children,
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    const baseStyles =
        "px-4 py-3 rounded-md font-medium transition w-full";

    const variants: Record<Variant, string> = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700",
        secondary:
            "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",
        danger:
            "bg-red-600 text-white hover:bg-red-700",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-100",
        ghost:
            "text-gray-700 hover:bg-gray-100",
    };

    return (
        <button
            {...props}
            className={`${baseStyles} ${variants[variant]} ${className || ""}`}
        >
            {children}
        </button>
    );
}
