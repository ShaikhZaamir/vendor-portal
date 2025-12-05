module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-blue-600",
    "hover:bg-blue-700",
    "bg-gray-100",
    "bg-red-600",
    "hover:bg-red-700",
    "text-gray-700",
    "border-gray-300",
    "hover:bg-gray-200",
    "hover:bg-gray-100",
  ],
  theme: { extend: {} },
  plugins: [],
};
