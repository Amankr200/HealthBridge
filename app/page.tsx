"use client"

import Link from "next/link"
import Image from "next/image"
import { Users, UserCog, Building2, ChevronDown, Globe, ArrowRight, Star } from "lucide-react"
import type { JSX } from "react"
import HealthFacilitiesMap from '@/components/ui/HealthFacilitiesMap';

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "@/components/translation-provider"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HealthBridge</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link 
              href="#services" 
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Services
            </Link>
            <Link 
              href="#testimonials" 
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Testimonials
            </Link>
            <Link 
              href="#map" 
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Map
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem>தமிழ் (Tamil)</DropdownMenuItem>
                <DropdownMenuItem>తెలుగు (Telugu)</DropdownMenuItem>
                <DropdownMenuItem>ಕನ್ನಡ (Kannada)</DropdownMenuItem>
                <DropdownMenuItem>മലയാളം (Malayalam)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={() => (window.location.href = "/auth")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>
      export default function WhatsAppButton() {
   
    <a
      href="https://www.whatsapp.com/channel/0029VbAIhK7JP20yCocKHE2c" // <-- Replace with your actual community link
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join WhatsApp Community"
      className="fixed bottom-5 right-5 w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
    >
      <img
        src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
        alt="WhatsApp"
        className="w-[30px] h-[30px]"
      />
    </a>
  
}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Empowering Health, Bridging Communities
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Accessible healthcare solutions designed specifically for underserved communities. Breaking barriers
                    to quality care through technology and compassion.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1" asChild>
                    <Link href="/auth">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <Image
                src="/assets/header_img.png"
                width={550}
                height={550}
                alt="Healthcare professionals helping a patient"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:aspect-square"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tailored healthcare solutions for everyone in the community
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {/* Patients Section */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">For Patients</h3>
                <p className="text-center text-muted-foreground">
                  Easy appointment scheduling, telehealth consultations, and access to your medical records.
                </p>
                <Button variant="outline" className="mt-2" asChild>
                  <Link href="/auth">Patient Portal</Link>
                </Button>
              </div>

              {/* Healthcare Providers Section */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">For Healthcare Providers</h3>
                <p className="text-center text-muted-foreground">
                  Streamlined patient management, secure communication, and collaborative care tools.
                </p>
                <Button variant="outline" className="mt-2" asChild>
                  <Link href="/auth">Provider Dashboard</Link>
                </Button>
              </div>

              {/* Administrators Section */}
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">For Administrators</h3>
                <p className="text-center text-muted-foreground">
                  Comprehensive analytics, resource management, and operational oversight tools.
                </p>
                <Button variant="outline" className="mt-2" asChild>
                  <Link href="/auth">Admin Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Testimonials</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from those who have experienced the difference
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {/* Testimonial 1 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image src="/assets/Testinomial_1.png" width={64} height={64} alt="Patient testimonial" className="object-cover" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground italic">
                    "HealthBridge has transformed how I access healthcare. As someone living in a rural area, the
                    telehealth services have been life-changing."
                  </p>
                  <h4 className="font-semibold">Kamala Devi</h4>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src="/assets/Testinomial_2.png"
                    width={64}
                    height={64}
                    alt="Healthcare provider testimonial"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground italic">
                    "The platform allows me to reach patients who would otherwise have limited access to specialized
                    care. It's making healthcare more equitable."
                  </p>
                  <h4 className="font-semibold">Dr. Rajendra Gaur</h4>
                  <p className="text-sm text-muted-foreground">Healthcare Provider</p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src="/assets/Testinomial_3.png"
                    width={64}
                    height={64}
                    alt="Community partner testimonial"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-muted-foreground italic">
                    "Partnering with HealthBridge has allowed our community center to offer better health resources to
                    our neighborhood. The multilingual support is especially valuable."
                  </p>
                  <h4 className="font-semibold">Surendra Nath</h4>
                  <p className="text-sm text-muted-foreground">Community Partner</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Facilities Map Section */}
        <section id="map" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Healthcare Near You</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover nearby healthcare facilities and services in your area
                </p>
              </div>
            </div>
            <div className="mt-8">
              <HealthFacilitiesMap />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform healthcare access?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our platform today and be part of the healthcare revolution for underserved communities.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1" asChild>
                  <Link href="/auth">
                    {t("book_appointment")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-8 py-8 md:py-12 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HealthBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">Empowering Health, Bridging Communities</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="text-muted-foreground hover:text-foreground">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#map" className="text-muted-foreground hover:text-foreground">
                    Map
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t("privacy_policy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {t("terms_of_service")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">123 Healthcare Ave, Suite 101</li>
                <li className="text-muted-foreground">contact@healthbridge.org</li>
                <li className="text-muted-foreground">(555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HealthBridge. {t("all_rights_reserved")}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

