import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--himalaya-black)] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-9xl md:text-[200px] font-display text-[var(--himalaya-red)] leading-none block">
              404
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display text-[var(--himalaya-white)] uppercase tracking-wider mb-6">
            Page Not Found
          </h1>
          
          <p className="text-[var(--himalaya-smoke)] text-lg mb-12">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[var(--himalaya-red)] hover:bg-[var(--himalaya-red)]/90 text-white"
            >
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[var(--himalaya-ice)]/20 text-[var(--himalaya-white)] hover:bg-[var(--himalaya-navy)]"
            >
              <Link to="/products">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
