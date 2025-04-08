"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Scan, AlertCircle, Check, Pill, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "@/components/translation-provider"
import { DynamicTranslation } from "@/components/dynamic-translation"
import { PageTransition } from "@/components/page-transition"

export default function PrescriptionScannerPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.match("image.*")) {
        setSelectedImage(file)
        setPreviewUrl(URL.createObjectURL(file))
        setScanResult(null)
        setError(null)

        console.log("Image type:", file.type) // Log the image type
        console.log("Image size:", file.size) // Log the image size
      } else {
        setError("Please upload an image file")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.match("image.*")) {
        setSelectedImage(file)
        setPreviewUrl(URL.createObjectURL(file))
        setScanResult(null)
        setError(null)
      } else {
        setError("Please upload an image file")
      }
    }
  }

  const handleScanPrescription = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Create a FormData object to send the image
      const formData = new FormData()
      formData.append("image", selectedImage)

      // Send the image to the API for OCR processing
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to process the prescription")
      }

      setScanResult(result.data)
    } catch (err) {
      console.error("Error scanning prescription:", err)
      setError(err instanceof Error ? `Error: ${err.message}` : "Failed to process the prescription. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageTransition className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-2">{t("prescription_scanner")}</h1>
      <p className="text-muted-foreground mb-8">
        Upload your prescription to extract medication details and doctor's recommendations using OCR technology.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {t("upload_prescription")}
            </CardTitle>
            <CardDescription>Upload a clear image of your prescription to scan and extract information</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                previewUrl ? "border-primary" : "border-muted-foreground/25"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Prescription preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2" />
                  <p className="mb-1 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs">PNG, JPG or PDF (max. 10MB)</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={handleScanPrescription} disabled={!selectedImage || isProcessing}>
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                  {t("processing")}
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  {t("scan_prescription")}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scanResult && (
            <Tabs defaultValue="medicines">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="medicines">{t("medicines")}</TabsTrigger>
                <TabsTrigger value="diagnosis">{t("diagnosis")}</TabsTrigger>
                <TabsTrigger value="fulltext">{t("fulltext")}</TabsTrigger>
              </TabsList>

              <TabsContent value="medicines" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      Prescribed Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResult.medicines && scanResult.medicines.length > 0 ? (
                        scanResult.medicines.map((medicine: any, index: number) => (
                          <div key={index} className="p-3 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium flex items-center gap-2">
                                  <DynamicTranslation text={medicine.name} />
                                  <Badge variant="outline" className="ml-2">
                                    <DynamicTranslation text={medicine.dosage} />
                                  </Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  <DynamicTranslation text={medicine.instructions} />
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <Check className="h-3 w-3" />
                                {t("add_to_meds")}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No medications detected in the prescription
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scanResult.followUp && (
                        <>
                          <p className="text-sm font-medium">Follow-up:</p>
                          <p className="text-sm text-muted-foreground">
                            <DynamicTranslation text={scanResult.followUp} />
                          </p>
                          <Separator className="my-2" />
                        </>
                      )}

                      {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                        <>
                          <p className="text-sm font-medium">Recommendations:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {scanResult.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                <DynamicTranslation text={rec} />
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {!scanResult.followUp &&
                        (!scanResult.recommendations || scanResult.recommendations.length === 0) && (
                          <div className="text-center py-4 text-muted-foreground">
                            No specific recommendations detected
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagnosis" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Doctor's Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scanResult.diagnosis ? (
                      <>
                        <DynamicTranslation text={scanResult.diagnosis} className="text-muted-foreground" />

                        <div className="mt-6">
                          <h3 className="text-sm font-medium mb-2">Understanding Your Condition:</h3>
                          <Progress value={70} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Based on your diagnosis, we've found resources that might help you understand your condition
                            better.
                          </p>
                          <Button variant="outline" size="sm" className="mt-4">
                            View Health Resources
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No diagnosis detected in the prescription
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fulltext" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Full Extracted Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                      <DynamicTranslation text={scanResult.fullText} />
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {!scanResult && !error && (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Prescription Scanned Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Upload a prescription image and click "Scan Prescription" to extract medication details and doctor's
                    recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-bold mb-4">How Prescription OCR Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">1</div>
              <h3 className="font-medium">Upload Image</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a clear photo of your prescription. Make sure all text is visible and the image is well-lit.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">2</div>
              <h3 className="font-medium">OCR Processing</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Our system uses Google Cloud Vision API to analyze the image and extract text from your prescription.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">3</div>
              <h3 className="font-medium">AI Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Google Gemini AI identifies medications, dosages, and doctor's recommendations from the extracted text.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
