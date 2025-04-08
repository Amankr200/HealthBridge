"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { useAppContext, type Doctor } from "@/app/providers/app-provider"

// Add dynamic rendering configuration
export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SpecialtyMenu } from "@/components/appointment/specialty-menu"
import { DoctorCard } from "@/components/appointment/doctor-card"
import { PageTransition } from "@/components/page-transition"

export default function BookAppointmentPage() {
  const { doctors, isLoading } = useAppContext()
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!doctors) return

    // Start with all doctors
    let filtered = [...doctors]

    // Apply specialty filter if selected
    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialty === selectedSpecialty)
    }

    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.address.line1.toLowerCase().includes(query) ||
          doctor.address.line2.toLowerCase().includes(query),
      )
    }

    setFilteredDoctors(filtered)
  }, [selectedSpecialty, searchQuery, doctors])

  const handleSpecialtySelect = (value: string) => {
    setSelectedSpecialty(value === "all" ? null : value)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <div className="text-lg text-muted-foreground">Loading doctors...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-lg font-medium text-muted-foreground mb-4">No doctors available</div>
              <Button onClick={() => router.refresh()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get unique specialties for the filter
  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.specialty)))

  // Sort doctors by specialty
  const doctorsBySpecialty = doctors.reduce((acc, doctor) => {
    const specialty = doctor.specialty
    if (!acc[specialty]) {
      acc[specialty] = []
    }
    acc[specialty].push(doctor)
    return acc
  }, {} as Record<string, Doctor[]>)

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-8 md:mx-10">
        {/* LEFT */}
        <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
            <p>Book Appointment</p>
            <p className="mt-4">With 100+ Trusted Doctors</p>
          </div>
          <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full mt-6 hover:scale-105 transition-all">
            Get Started
          </Button>
        </div>
        {/* RIGHT - Add a decorative element for better visibility */}
        <div className="hidden md:flex md:w-1/3 items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary text-xl font-bold">
                100+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Menu */}
      <SpecialtyMenu selectedSpecialty={selectedSpecialty} onSelectSpecialty={setSelectedSpecialty} />

      {/* Search and Filter */}
      <div className="container max-w-6xl mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search doctors, specialties, or locations"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={handleSpecialtySelect} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {Array.from(new Set(doctors.map((doc) => doc.specialty))).map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Doctors</TabsTrigger>
            <TabsTrigger value="available">Available Today</TabsTrigger>
            <TabsTrigger value="top">Top Rated</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg font-medium text-muted-foreground">No doctors found matching your criteria</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedSpecialty(null)
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredDoctors.length > 0 && (
          <div className="flex justify-center mb-16">
            <Button variant="outline" className="px-12 py-6 rounded-full">
              Load More
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

