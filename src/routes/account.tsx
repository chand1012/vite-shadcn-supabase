import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Upload, CreditCard } from "lucide-react";

export default function UserAccount({
  user = {
    displayName: "John Doe",
    fullName: "John Michael Doe",
    email: "john@example.com",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    hasSubscription: false,
  },
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const navigate = useNavigate();

  const handleAvatarUpload = (event) => {
    // Placeholder for avatar upload functionality
    console.log("Avatar upload:", event.target.files[0]);
    // In a real implementation, you would upload the file and update the avatar URL
    // setAvatar(URL.createObjectURL(event.target.files[0]))
  };

  const handleGravatarSet = () => {
    // Placeholder for setting Gravatar
    console.log("Setting Gravatar");
    // In a real implementation, you would fetch the Gravatar URL and update the avatar
    // setAvatar(`https://www.gravatar.com/avatar/${md5(user.email)}?d=identicon`)
  };

  const handleManageSubscription = () => {
    if (user.hasSubscription) {
      // Redirect to Stripe customer portal
      console.log("Redirecting to Stripe customer portal");
    } else {
      // Navigate to pricing page
      navigate("/pricing");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>
          Manage your account settings and subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatar} alt={user.displayName} />
            <AvatarFallback>
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="mr-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Avatar
              </Label>
            </Button>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button variant="outline" onClick={handleGravatarSet}>
              Use Gravatar
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input id="display-name" value={user.displayName} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" value={user.fullName} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} readOnly />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleManageSubscription}>
          <CreditCard className="w-4 h-4 mr-2" />
          {user.hasSubscription ? "Manage Subscription" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
