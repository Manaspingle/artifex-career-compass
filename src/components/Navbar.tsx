import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Briefcase, FileText, Search, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearToken, getToken } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/tracker", label: "Job Tracker", icon: Briefcase },
  { to: "/jobs", label: "Find Jobs", icon: Search },
  { to: "/resume", label: "Resume AI", icon: FileText },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-black text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            ARTIFEX
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname === item.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                pathname === item.to
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
