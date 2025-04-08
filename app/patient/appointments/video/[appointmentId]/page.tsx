"use client"

import { useRouter } from "next/navigation"
import { PeerVideoCall } from "@/components/appointment/PeerVideoCall"
import { PageTransition } from "@/components/page-transition"

export default function VideoAppointmentPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  const router = useRouter()

  const handleEndCall = () => {
    router.push("/patient/appointments/my-appointments")
  }

  return (
    <PageTransition className="container max-w-4xl py-8">
      <PeerVideoCall
        appointmentId={params.appointmentId}
        role="patient"
        onEndCall={handleEndCall}
      />
    </PageTransition>
  )
}