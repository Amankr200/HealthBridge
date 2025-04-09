"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  FileText,
  LogOut,
  Star,
  User,
  ChevronDown,
  Bell,
  Video,
  Pill,
  FileCheck,
  Activity,
  Stethoscope,
} from "lucide-react"
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/components/translation-provider"
import { DynamicTranslation } from "@/components/dynamic-translation"
import SchemesPage from "../../data/schemes";
import { PageTransition } from "@/components/page-transition"

export default function PatientDashboard() {
  const [userName, setUserName] = useState("Ramu Lal")
  const { t } = useTranslation()

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HealthBridge</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <LanguageSelector />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>{t("my_records")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("logout")}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 container py-8">
          <div className="grid gap-8">
            {/* Welcome Section */}
            <section className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {t("welcome")}, {userName}
              </h1>
              <p className="text-muted-foreground">{t("dashboard_subtitle")}</p>
            </section>

            {/* Quick Actions */}
            <section className="grid gap-4 md:grid-cols-4">
              <Button className="h-auto py-4 gap-2" asChild>
                <Link href="/patient/appointments/book">
                  <Calendar className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>{t("book_appointment")}</span>
                    <span className="text-xs text-muted-foreground">{t("schedule_visit")}</span>
                  </div>
                </Link>
              </Button>

              <Button className="h-auto py-4 gap-2" asChild>
                <Link href="/patient/prescription-scanner">
                  <FileText className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>{t("prescription_scanner")}</span>
                    <span className="text-xs text-muted-foreground">{t("ocr_prescriptions")}</span>
                  </div>
                </Link>
              </Button>

              <Button className="h-auto py-4 gap-2" asChild>
                <Link href="/patient/records">
                  <FileText className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>{t("view_records")}</span>
                    <span className="text-xs text-muted-foreground">{t("access_medical_history")}</span>
                  </div>
                </Link>
              </Button>

              <Button className="h-auto py-4 gap-2" asChild>
              <Link href="https://voice-and-vision-bot2-1.onrender.com" target="_blank" rel="noopener noreferrer">
                <Stethoscope className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Initial Aid Assistant</span>
                  <span className="text-xs text-muted-foreground">{t("ai_health_insights")}</span>
                </div>
              </Link>
            </Button>

            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Upcoming Appointments */}
              <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">Upcoming Appointments</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/patient/appointments">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Today
                            </Badge>
                            <h3 className="font-semibold">Virtual Consultation</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Dr. Rajendra Gaur - Orthopedist</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>March 18, 2025</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>2:30 PM</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="default" size="sm" className="gap-1">
                          <Video className="h-4 w-4" />
                          Join Now
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">Follow-up Appointment</h3>
                          <p className="text-sm text-muted-foreground">Dr. Sangeeta Gupta - Gynecologist</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>March 25, 2025</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>10:00 AM</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">In-person</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Health Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Health Records</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Prescription Renewal</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Mar 10</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Lisinopril 10mg - 30 day supply</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Lab Results</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Feb 28</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Complete Blood Count (CBC)</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Vital Signs</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Feb 15</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Blood Pressure: 120/80 mmHg</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/patient/records">{t("view_records")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <SchemesPage/>

          </div>
        </main>

        <footer className="w-full border-t bg-background">
          <div className="container py-6 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HealthBridge. {t("all_rights_reserved")}
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                {t("privacy_policy")}
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                {t("terms_of_service")}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}

