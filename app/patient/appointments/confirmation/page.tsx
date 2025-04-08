"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, Clock, Video, MapPin, ArrowRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"

export default function AppointmentConfirmationPage() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    id: "APT-" + Math.floor(Math.random() * 10000),
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      image: "/placeholder.svg?height=200&width=200",
    },
    date: "March 20, 2025",
    time: "02:00 PM",
    type: "Video Consultation",
    location: "Virtual",
    notes:
      "Please be online 5 minutes before your scheduled appointment time. Make sure you have a stable internet connection and a quiet environment.",
  })

  const router = useRouter()

  return (
    <PageTransition className="container max-w-4xl py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Appointment Confirmed!</h1>
        <p className="text-muted-foreground">
          Your appointment has been successfully scheduled. We've sent the details to your email.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={appointmentDetails.doctor.image || "/placeholder.svg"}
                  alt={appointmentDetails.doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold">{appointmentDetails.doctor.name}</h2>
                <p className="text-primary">{appointmentDetails.doctor.specialty}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{appointmentDetails.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{appointmentDetails.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Appointment Type</p>
                    <p className="text-sm text-muted-foreground">{appointmentDetails.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{appointmentDetails.location}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Appointment ID</p>
                <p className="text-sm text-muted-foreground">{appointmentDetails.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <p className="text-sm font-medium mb-1">Notes</p>
          <p className="text-sm text-muted-foreground mb-4">{appointmentDetails.notes}</p>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Appointment Details
          </Button>
        </CardFooter>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <Button className="flex-1 gap-2" onClick={() => router.push("/patient/dashboard")}>
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => router.push("/patient/appointments")}>
          View All Appointments
        </Button>
      </div>
    </PageTransition>
  )
}

