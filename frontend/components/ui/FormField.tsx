interface FormFieldProps {
    label?: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

export default function FormField({
    label,
    required,
    error,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={`space-y-1 ${className || ""}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {children}

            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}
        </div>
    );
}
