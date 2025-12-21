import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
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
      <div className="text-center glass-card p-12 rounded-2xl">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">صفحه مورد نظر یافت نشد</p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
