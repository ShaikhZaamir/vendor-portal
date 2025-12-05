interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export default function Input({ error, className, ...props }: InputProps) {
    return (
        <div>
            <input
                {...props}
                className={`
          w-full bg-white border border-gray-300 rounded-md px-4 py-3
          text-gray-800 placeholder-gray-500 outline-none
          focus:border-blue-600 focus:ring-2 focus:ring-blue-200
          invalid:border-red-500 invalid:ring-red-200 peer
          ${className || ""}
        `}
            />

            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}
