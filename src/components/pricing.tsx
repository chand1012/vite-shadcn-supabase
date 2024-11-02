import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { useUser } from "@/hooks/use-user";
import { useSupabase } from "@/hooks/use-supabase";
import usePricing from "@/hooks/use-pricing";

interface Price {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

interface Product {
  id: string;
  object: string;
  active: boolean;
  attributes: unknown[];
  created: number;
  default_price: unknown;
  description: string;
  images: unknown[];
  livemode: boolean;
  marketing_features: unknown[];
  metadata: {
    index: string;
  };
  name: string;
  package_dimensions: unknown;
  shippable: boolean;
  statement_descriptor: unknown;
  tax_code: unknown;
  type: string;
  unit_label: unknown;
  updated: number;
  url: string;
  prices: Price[];
}

const planFeatures: Record<string, string[]> = {
  hobby: [
    "Up to 3 projects",
    "1GB storage",
    "Basic support",
    "Access to community forums",
  ],
  freelancer: [
    "Unlimited projects",
    "10GB storage",
    "Priority support",
    "Access to premium templates",
    "Collaboration tools",
  ],
};

type Plan = {
  name: string;
  price: number;
  price_id: string;
  description: string;
  yearly: boolean;
  features: string[];
};

type PricingCardProps = {
  plan: Plan;
  checkoutCallback: (price: string) => Promise<void>;
};

const PricingCard = ({ plan, checkoutCallback }: PricingCardProps) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await checkoutCallback(plan.price_id);
    setLoading(false);
  };

  return (
    <Card key={plan.name} className="flex flex-col">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-4xl font-bold mb-4">
          ${plan.price}
          <span className="text-lg font-normal text-muted-foreground">
            {plan.yearly ? "/year" : "/month"}
          </span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button disabled={loading} onClick={handleClick} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Choose {plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
};

export function PricingSection() {
  const user = useUser();
  const supabase = useSupabase();
  const { data: pricing, isLoading } = usePricing();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  // if the pricing data is present, separate into monthly and yearly plans
  const monthly: Plan[] | undefined = pricing?.data.map((product: Product) => {
    const monthlyPrice = product.prices.find(
      (price: Price) => price.name === "Monthly"
    )!;
    return {
      name: product.name,
      price: monthlyPrice?.amount / 100,
      yearly: false,
      price_id: monthlyPrice.id,
      description: product.description,
      features: planFeatures[product.name.toLowerCase()],
    } as Plan;
  });

  const yearly: Plan[] | undefined = pricing?.data.map((product: Product) => {
    const yearlyPrice = product.prices.find(
      (price: Price) => price.name === "Yearly"
    )!;
    return {
      name: product.name,
      yearly: true,
      description: product.description,
      price_id: yearlyPrice.id,
      price: yearlyPrice?.amount / 100,
      features: planFeatures[product.name.toLowerCase()],
    };
  });

  const handleStripeCheckout = async (price: string) => {
    // if they are not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    console.log({ price });

    // call the supabase function checkout
    const { data, error } = await supabase.functions.invoke("checkout", {
      body: { price: price },
    });

    if (error) {
      console.error(error);
      return;
    }

    // otherwise, redirect to the checkout page which can be found as data.url
    window.location.href = data.url;
  };

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
      <p className="text-xl text-center text-muted-foreground mb-8">
        Select the perfect plan for your needs. Upgrade or downgrade at any
        time.
      </p>
      <div className="flex items-center justify-center mb-8">
        <span
          className={`mr-2 ${
            isYearly ? "text-muted-foreground" : "font-semibold"
          }`}
        >
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Toggle yearly billing"
        />
        <span
          className={`ml-2 ${
            isYearly ? "font-semibold" : "text-muted-foreground"
          }`}
        >
          Yearly
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {isLoading && <p>Loading...</p>}
        {!isYearly &&
          monthly?.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              checkoutCallback={handleStripeCheckout}
            />
          ))}
        {isYearly &&
          yearly?.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              checkoutCallback={handleStripeCheckout}
            />
          ))}
      </div>
    </section>
  );
}
