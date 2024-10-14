import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSupabase } from "@/hooks/use-supabase";
import { useUser } from "@/hooks/use-user";
import { Navbar } from "@/components/Navbar";

export default function RootPage() {
  const user = useUser();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Welcome
              </CardTitle>
              <CardDescription className="text-center">
                You are logged in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              Choose an option to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/login" className="block w-full">
              <Button variant="default" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/register" className="block w-full">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
