import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Film, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Film className="h-24 w-24 text-accent mx-auto mb-8" />
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page seems to have vanished into the void...
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-accent to-cinema-gold text-black font-semibold">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
