import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    // Parse the form data to get the image
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 })
    }

    // Validate image size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image size must be less than 10MB" }, { status: 400 })
    }

    // Validate image type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid image type. Please upload a JPEG, PNG, or WebP image",
        },
        { status: 400 },
      )
    }

    // Convert the image to base64
    const imageBytes = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(imageBytes).toString("base64")
    const mimeType = imageFile.type

    // Validate API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      console.error("Missing Gemini API key")
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
        },
        { status: 500 },
      )
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Create a prompt that includes the image for Gemini to analyze
    const prompt = `
      You are a medical assistant analyzing a prescription image. 
      Extract all text from this prescription image, then analyze the extracted text to identify:
      1. List of medicines with their dosages and instructions
      2. Diagnosis or medical condition
      3. Follow-up instructions
      4. Any lifestyle or dietary recommendations
      
      Format your response as a JSON object with the following structure:
      {
        "fullText": "The complete extracted text from the image",
        "medicines": [
          { "name": "Medicine Name", "dosage": "Dosage", "instructions": "Instructions" }
        ],
        "diagnosis": "Diagnosis text",
        "followUp": "Follow-up instructions",
        "recommendations": ["Recommendation 1", "Recommendation 2"]
      }
    `

    try {
      // Process the image with Gemini
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ])

      const response = await result.response
      const responseText = response.text()

      // Extract the JSON from the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/)
      let structuredData = {}

      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1] || jsonMatch[0]
          structuredData = JSON.parse(jsonStr)
        } catch (error) {
          console.error("Error parsing JSON from Gemini response:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to parse prescription data",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          )
        }
      }

      // Return the OCR results and structured data
      return NextResponse.json({
        success: true,
        data: structuredData,
      })
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process image with Gemini API",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing OCR request:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process the prescription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

