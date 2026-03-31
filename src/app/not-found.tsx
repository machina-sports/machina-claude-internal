import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-zinc-700 mb-4">404</h1>
      <p className="text-lg text-zinc-400 mb-8">Page not found.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-machina-orange hover:bg-machina-orange-dark text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
