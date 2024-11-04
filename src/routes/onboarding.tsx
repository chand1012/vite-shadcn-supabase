import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type OnboardingData = {
  name: string;
  displayName: string;
  referralCode: string;
};

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    displayName: "",
    referralCode: "",
  });
  const navigate = useNavigate();

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = () => {
    // Here you would typically send the collected data to your backend
    console.log("Onboarding data:", data);
    // Navigate to the main app or dashboard
    navigate("/dashboard");
  };

  const steps = [
    {
      title: "Personal Information",
      component: <PersonalInformation data={data} updateData={updateData} />,
    },
    {
      title: "Referral",
      component: <Referral data={data} updateData={updateData} />,
    },
    {
      title: "Welcome",
      component: <Welcome data={data} onFinish={handleFinish} />,
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          We're glad you're here! Let's get your account set up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? "bg-primary text-primary-foreground"
                      : step === index + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {step > index + 1 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      step > index + 1 ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {steps[step - 1].title}
          </h3>
          {steps[step - 1].component}
        </div>
        <div className="flex justify-between">
          <Button onClick={handlePrev} disabled={step === 1} variant="outline">
            Previous
          </Button>
          {step < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleFinish}>Get Started</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PersonalInformation({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={data.displayName}
          onChange={(e) => updateData({ displayName: e.target.value })}
          placeholder="johndoe"
        />
      </div>
    </div>
  );
}

function Referral({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
        <Input
          id="referralCode"
          value={data.referralCode}
          onChange={(e) => updateData({ referralCode: e.target.value })}
          placeholder="Enter referral code"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        If you have a referral code, enter it here to claim your bonus.
      </p>
    </div>
  );
}

function Welcome({
  data,
  onFinish,
}: {
  data: OnboardingData;
  onFinish: () => void;
}) {
  return (
    <div className="space-y-4 text-center">
      <h4 className="text-2xl font-bold">
        Welcome, {data.displayName || data.name}!
      </h4>
      <p>
        Your account is now set up and ready to go. Click the button below to
        get started with our platform.
      </p>
      <Button onClick={onFinish} className="w-full">
        Get Started
      </Button>
    </div>
  );
}
