import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { User, CreditCard } from "lucide-react";
import md5 from "md5";
import useAsyncEffect from "use-async-effect";
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
import { useSupabase, useUser } from "@/hooks/use-supabase";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";

type UserData = {
  username?: string;
  full_name?: string;
  avatar_url?: string;
};

export default function AccountPage() {
  const user = useUser();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { copy, copied } = useClipboard({ timeout: 1000 });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<string | null>(null);

  const handleGravatarSet = () => {
    if (!user) return;
    // Placeholder for setting Gravatar
    console.log("Setting Gravatar");
    // In a real implementation, you would fetch the Gravatar URL and update the avatar
    const url = `https://www.gravatar.com/avatar/${md5(
      user?.email as string
    )}?d=identicon`;
    setUserData({
      avatar_url: url,
      ...userData,
    });
    supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", user.id)
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error updating user avatar:", error.message);
          return;
        }
        console.log("User avatar updated:", data);
      });
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    if (subscription) {
      const { data, error } = await supabase.functions.invoke("billing");
      if (error) {
        console.error("Error fetching subscription data:", error.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } else {
      // Navigate to pricing page
      navigate("/pricing");
    }
    setLoading(false);
  };

  // TODO this runs 3-6 times on initial load
  // it should run once and then only when the user changes
  useAsyncEffect(async () => {
    if (user) {
      if (!userData) {
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("username, full_name, avatar_url")
            .eq("id", user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }
          setUserData(userData as UserData);
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      }

      if (!subscription) {
        try {
          // also get subscription status
          const { data: subscription, error: subscriptionError } =
            await supabase
              .from("subscriptions")
              .select("status")
              .eq("user_id", user.id)
              .single();

          if (subscriptionError) {
            throw new Error(subscriptionError.message);
          }

          setSubscription(subscription?.status);
        } catch (e) {
          console.error(e);
        }
      }

      if (!code) {
        try {
          const { data: referralData, error: referralError } = await supabase
            .from("referral_codes")
            .select("code")
            .eq("user_id", user.id)
            .single();

          if (referralError) {
            throw new Error(referralError.message);
          }
          setCode(referralData?.code);
        } catch (e) {
          console.error("Error fetching referral code:", e);
          // generate a new referral code
          const resp = await supabase.functions.invoke("gen_referral_code");
          if (resp.error) {
            console.error(
              "Error generating referral code:",
              resp.error.message
            );
            return;
          }

          setCode(resp.data?.code);
        }
      }

      setLoading(false);
    }
  }, [user]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      full_name: event.target.value,
    });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      username: event.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    if (!user) return;
    if (!userData) return;
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", user.id)
      .select();
    if (error) {
      console.error("Error updating user data:", error.message);
      setLoading(false);
      return;
    }
    console.log("User data updated:", data);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>
          Manage your account settings and subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={userData?.avatar_url}
              alt={userData?.username || "user"}
            />
            <AvatarFallback>
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" onClick={handleGravatarSet}>
              Use Gravatar
            </Button>
          </div>
        </div>
        <ThemeToggle />
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            disabled={loading || !user}
            id="display-name"
            value={userData?.username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            disabled={loading || !user}
            id="full-name"
            value={userData?.full_name}
            onChange={handleNameChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email} readOnly />
        </div>
        <div className="space-y-2">
          <Button onClick={handleSave} className="w-full">
            <IconDeviceFloppy className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral">Referral Code</Label>
          <p className="text-sm text-muted-foreground">
            Share this code with your friends to earn rewards! You'll get 3 days
            of free hobby access for each friend who signs up, and they'll get
            an extended free trial and 10% off their first month or year!
          </p>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input id="referral" value={code} readOnly />
          <Button onClick={() => copy(code)}>
            {copied ? "Code Copied!" : "Copy Code"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={loading}
          className="w-full"
          onClick={handleManageSubscription}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {subscription ? "Manage Subscription" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
