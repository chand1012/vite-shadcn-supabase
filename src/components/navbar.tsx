import { Link, useNavigate } from "react-router-dom";
// @ts-expect-error we don't care about types for this package
import { HashLink } from "react-router-hash-link";
import { Button } from "@/components/ui/button";
import { useSupabase, useUser } from "@/hooks/use-supabase";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const user = useUser();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const NavItems = () => (
    <>
      {user ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/account">Account</Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <HashLink to="/about#contact">Contact Us</HashLink>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </>
      )}
    </>
  );

  const AuthButtons = () => <></>;

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="mr-4 flex-1">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">YourLogo</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavItems />
          <AuthButtons />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pl-0">
            <div className="flex flex-col space-y-4 mt-4">
              <NavItems />
              <div className="pt-4 border-t">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
