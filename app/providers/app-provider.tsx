"use client"

import { createContext, useContext, useState, useEffect } from "react"

export interface Doctor {
  _id: string
  name: string
  specialty: string
  image: string
  degree: string
  experience: string
  fees: number
  about: string
  videoConsultation: boolean
  address: {
    line1: string
    line2: string
  }
}

export interface Appointment {
  id: string
  doctor: Doctor
  patient: {
    _id: string
    name: string
    image?: string
  }
  date: string
  time: string
  type: 'video' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface AppContextType {
  doctors: Doctor[]
  appointments: Appointment[]
  isLoading: boolean
  currencySymbol: string
  user: { uid: string; name: string } | null // Add the user property
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'patient'>) => void
  removeAppointment: (appointmentId: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null) // Add user state
  const currencySymbol = "₹"

  useEffect(() => {
    // Simulate loading doctors data
    const doctorsData: Doctor[] = [
      {
        _id: "1",
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        image: "/assets/doctors/doc1.png",
        degree: "MD, DM (Cardiology)",
        experience: "15 years",
        fees: 150,
        about: "Experienced cardiologist with expertise in preventive cardiology and heart failure management.",
        videoConsultation: true,
        address: {
          line1: "Apollo Hospital",
          line2: "Delhi, India"
        }
      },
      {
        _id: "2",
        name: "Dr. Priya Sharma",
        specialty: "Pediatrician",
        image: "/assets/doctors/doc2.png",
        degree: "MD, DNB (Pediatrics)",
        experience: "12 years",
        fees: 120,
        about: "Specialized in child healthcare with focus on growth and development.",
        videoConsultation: true,
        address: {
          line1: "Fortis Hospital",
          line2: "Mumbai, India"
        }
      },
      {
        _id: "3",
        name: "Dr. Amit Patel",
        specialty: "Orthopedist",
        image: "/assets/doctors/doc3.png",
        degree: "MS (Orthopedics)",
        experience: "18 years",
        fees: 200,
        about: "Expert in joint replacement and sports medicine.",
        videoConsultation: true,
        address: {
          line1: "Max Hospital",
          line2: "Bangalore, India"
        }
      },
      {
        _id: "4",
        name: "Dr. Priyanshu Dubey",
        specialty: "Neurologist",
        image: "/assets/doctors/doc8.png",
        degree: "MD, DM (Neurology)",
        experience: "14 years",
        fees: 180,
        about: "Specialized in treating neurological disorders and stroke management.",
        videoConsultation: true,
        address: {
          line1: "Narayana Health",
          line2: "Hyderabad, India"
        }
      },
      {
        _id: "5",
        name: "Dr. Arun Verma",
        specialty: "Dermatologist",
        image: "/assets/doctors/doc4.png",
        degree: "MD (Dermatology)",
        experience: "10 years",
        fees: 100,
        about: "Expert in treating skin conditions and cosmetic procedures.",
        videoConsultation: true,
        address: {
          line1: "Kokilaben Hospital",
          line2: "Mumbai, India"
        }
      },
      {
        _id: "6",
        name: "Dr. Sangeeta Gupta",
        specialty: "Gynecologist",
        image: "/assets/doctors/doc5.png",
        degree: "MD, DGO",
        experience: "16 years",
        fees: 150,
        about: "Specialized in women's health, pregnancy care, and gynecological surgeries.",
        videoConsultation: true,
        address: {
          line1: "Artemis Hospital",
          line2: "Gurgaon, India"
        }
      },
      {
        _id: "7",
        name: "Dr. Vikram Singh",
        specialty: "ENT Specialist",
        image: "/assets/doctors/doc6.png",
        degree: "MS (ENT)",
        experience: "13 years",
        fees: 120,
        about: "Expert in treating ear, nose, and throat conditions with focus on minimally invasive procedures.",
        videoConsultation: true,
        address: {
          line1: "Medanta Hospital",
          line2: "Delhi, India"
        }
      },
      {
        _id: "8",
        name: "Dr. Anjali Desai",
        specialty: "Psychiatrist",
        image: "/assets/doctors/doc9.png",
        degree: "MD (Psychiatry)",
        experience: "11 years",
        fees: 200,
        about: "Specialized in mental health disorders, stress management, and behavioral therapy.",
        videoConsultation: true,
        address: {
          line1: "Manipal Hospital",
          line2: "Bangalore, India"
        }
      }
    ]

    // Add test appointments
    const testAppointments: Appointment[] = [
      {
        id: "test-appointment-1",
        doctor: doctorsData[0],
        patient: {
          _id: "patient-1",
          name: "Sarah Johnson",
          image: "/placeholder.svg"
        },
        date: new Date().toLocaleDateString(),
        time: "2:30 PM - 3:00 PM",
        type: "video",
        status: "scheduled"
      }
    ]

    // Simulate API delay
    setTimeout(() => {
      setDoctors(doctorsData)
      setAppointments(testAppointments)
      setUser({ uid: "example-uid", name: "John Doe" }) // Replace with actual user data
      setIsLoading(false)
    }, 1000)

    // Load saved appointments
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      setAppointments(prev => [...prev, ...JSON.parse(savedAppointments)])
    }
  }, [])

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'patient'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
      status: 'scheduled',
      patient: {
        _id: 'current-user-id',
        name: 'Current User',
        image: '/placeholder.svg'
      }
    }
    const newAppointments = [...appointments, newAppointment]
    setAppointments(newAppointments)
    localStorage.setItem("appointments", JSON.stringify(newAppointments))
  }

  const removeAppointment = (appointmentId: number) => {
    const newAppointments = appointments.filter((_, index) => index !== appointmentId)
    setAppointments(newAppointments)
    localStorage.setItem("appointments", JSON.stringify(newAppointments))
  }

  return (
    <AppContext.Provider
      value={{
        doctors,
        appointments,
        isLoading,
        currencySymbol,
        user, // Provide user in the context
        addAppointment,
        removeAppointment
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}