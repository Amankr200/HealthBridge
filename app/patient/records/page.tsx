"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/app/providers/app-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import {
  uploadMedicalRecord,
  getUserMedicalRecords,
  deleteMedicalRecord,
  type MedicalRecord
} from "@/lib/firebase/storage"
import { PageTransition } from "@/components/page-transition"

export default function PatientRecordsPage() {
  const { isLoading, user } = useAppContext()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user?.uid) {
      loadRecords()
    }
  }, [user?.uid])

  const loadRecords = async () => {
    if (!user?.uid) return
    const userRecords = await getUserMedicalRecords(user.uid)
    setRecords(userRecords)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user?.uid) return

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    try {
      const record = await uploadMedicalRecord(file, user.uid)
      setRecords(prev => [...prev, record])
      toast.success("Record uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload record")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (record: MedicalRecord) => {
    if (!user?.uid) return

    try {
      const success = await deleteMedicalRecord(`medical-records/${user.uid}/${record.fileName}`)
      if (success) {
        setRecords(prev => prev.filter(r => r.id !== record.id))
        toast.success("Record deleted successfully")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete record")
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Medical Records</h1>

      <div className="grid gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOC, or Images (MAX. 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{record.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {new Date(record.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(record.fileUrl)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {records.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No records found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}