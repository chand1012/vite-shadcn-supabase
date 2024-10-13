import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RootPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
  );
}
