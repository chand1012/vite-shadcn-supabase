import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, Users, Coffee, Code } from "lucide-react";
import {
  IconBrandX,
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export default function AboutUsPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center mb-4">
            About Our Startup Journey
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 text-center">
            We're a small team with big dreams, dedicated to revolutionizing the
            way businesses operate through innovative SaaS solutions.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Our Story
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Our team at work"
                className="rounded-lg shadow-lg"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                icon: Rocket,
                title: "Innovation",
                description:
                  "We're always pushing the boundaries of what's possible in SaaS.",
              },
              {
                icon: Users,
                title: "Collaboration",
                description:
                  "We believe in the power of teamwork and open communication.",
              },
              {
                icon: Coffee,
                title: "Work-Life Balance",
                description:
                  "We value our team's wellbeing and encourage a healthy lifestyle.",
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <value.icon className="mr-2 h-6 w-6 text-primary" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Meet Our Small (but Mighty) Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: "Jane Doe", role: "Founder & CEO", avatar: "J" },
              { name: "John Smith", role: "CTO", avatar: "J" },
              { name: "Alice Johnson", role: "Lead Developer", avatar: "A" },
              { name: "Bob Williams", role: "UX Designer", avatar: "B" },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={`/placeholder.svg?text=${member.avatar}&width=96&height=96`}
                    alt={member.name}
                  />
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Our Mission
          </h2>
          <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400 text-center mb-12">
            At our core, we're driven by the desire to empower businesses
            through innovative SaaS solutions. We believe that with the right
            tools, any company can achieve extraordinary results.
          </p>
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Code className="mr-2 h-6 w-6 text-primary" />
                Our Commitment to Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Join Us on Our Journey
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              We're always looking for passionate individuals to join our
              growing team. If you're excited about shaping the future of SaaS,
              we'd love to hear from you!
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/careers">
                Explore Careers <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Media Links Section */}
      <section
        id="contact"
        className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Connect With Us
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 text-center mb-12">
            Stay up to date with our latest news, updates, and insights by
            following us on social media.
          </p>
          <div className="flex space-x-6">
            {[
              {
                icon: IconBrandX,
                href: "https://twitter.com/yourstartup",
                label: "X",
              },
              {
                icon: IconBrandLinkedin,
                href: "https://linkedin.com/company/yourstartup",
                label: "LinkedIn",
              },
              {
                icon: IconBrandInstagram,
                href: "https://instagram.com/yourstartup",
                label: "Instagram",
              },
              {
                icon: IconBrandGithub,
                href: "https://github.com/yourstartup",
                label: "GitHub",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label={`Follow us on ${social.label}`}
              >
                <social.icon className="h-8 w-8" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
