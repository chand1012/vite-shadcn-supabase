import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
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
import type { Tables } from "@/types/database";

type Price = Tables<"prices">;

const plans = [
  {
    name: "Hobby",
    description: "Perfect for side projects and hobbyists",
    monthlyPrice: 10,
    yearlyPrice: 100,
    features: [
      "Up to 3 projects",
      "1GB storage",
      "Basic support",
      "Access to community forums",
    ],
  },
  {
    name: "Freelance",
    description: "Ideal for freelancers and small businesses",
    monthlyPrice: 20,
    yearlyPrice: 200,
    features: [
      "Unlimited projects",
      "10GB storage",
      "Priority support",
      "Access to premium templates",
      "Collaboration tools",
    ],
  },
];

export function PricingSection() {
  const user = useUser();
  const [isYearly, setIsYearly] = useState(false);

  const handleStripeCheckout = async (price: Price) => {};

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
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4">
                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-lg font-normal text-muted-foreground">
                  {isYearly ? "/year" : "/month"}
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
              <Button className="w-full" asChild>
                <Link
                  to={`/signup?plan=${plan.name.toLowerCase()}&billing=${
                    isYearly ? "yearly" : "monthly"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
