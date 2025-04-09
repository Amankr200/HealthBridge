"use server"

import { cookies } from "next/headers"
import { OAuth2Client } from "google-auth-library"
import crypto from "crypto"

// Create a new OAuth client
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

// Mock database of users for demo purposes
// In a real app, you would use a database
const mockUsers = new Map([
  [
    "admin@example.com",
    {
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      password: hashPassword("admin123"),
      role: "admin",
    },
  ],
  [
    "doctor@example.com",
    {
      id: "doctor-1",
      email: "doctor@example.com",
      name: "Dr. Rajendra Gaur",
      password: hashPassword("doctor123"),
      role: "provider",
    },
  ],
  [
    "patient@example.com",
    {
      id: "patient-1",
      email: "patient@example.com",
      name: "Ramu Lal",
      password: hashPassword("patient123"),
      role: "patient",
    },
  ],
])

// Simple password hashing function
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function verifyGoogleToken(token: string) {
  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })

    // Get the payload from the ticket
    const payload = ticket.getPayload()

    if (!payload) {
      throw new Error("Invalid token payload")
    }

    // Extract user information
    const userId = payload.sub
    const email = payload.email
    const name = payload.name
    const picture = payload.picture

    // Determine user role based on email
    let role = "patient" // default role
    if (email?.includes("admin")) {
      role = "admin"
    } else if (email?.includes("provider") || email?.includes("doctor")) {
      role = "provider"
    }

    // Create a session
    const userSession = {
      id: userId,
      email,
      name,
      picture,
      role,
      isAuthenticated: true,
    }

    // Set a cookie with the session information
    cookies().set("user-session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      user: {
        id: userId,
        email,
        name,
        picture,
        role,
      },
    }
  } catch (error) {
    console.error("Error verifying Google token:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Updated login function with proper authentication
export async function loginWithEmailPassword(email: string, password: string) {
  try {
    // Check if user exists in our mock database
    const user = mockUsers.get(email.toLowerCase())

    if (!user) {
      return {
        success: false,
        error: "User not found. Please register first.",
      }
    }

    // Verify password
    const hashedPassword = hashPassword(password)
    if (user.password !== hashedPassword) {
      return {
        success: false,
        error: "Invalid password. Please try again.",
      }
    }

    // Determine redirect path based on role
    let redirectPath = "/patient/dashboard"
    if (user.role === "admin") {
      redirectPath = "/admin/dashboard"
    } else if (user.role === "provider") {
      redirectPath = "/provider/dashboard"
    }

    // Create a user session
    const userSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isAuthenticated: true,
    }

    // Set the session cookie
    cookies().set("user-session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectPath,
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// New registration function
export async function registerUser(email: string, password: string, role = "patient") {
  try {
    // Check if user already exists
    if (mockUsers.has(email.toLowerCase())) {
      return {
        success: false,
        error: "User already exists with this email.",
      }
    }

    // Create a new user
    const userId = `user-${Date.now()}`
    const name = email.split("@")[0]
    const hashedPassword = hashPassword(password)

    // Create the new user object
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
    }

    // Add to mock database
    mockUsers.set(email.toLowerCase(), newUser)

    // Create a user session
    const userSession = {
      id: userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isAuthenticated: true,
    }

    // Set the session cookie
    cookies().set("user-session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Determine redirect path based on role
    let redirectPath = "/patient/dashboard"
    if (role === "admin") {
      redirectPath = "/admin/dashboard"
    } else if (role === "provider") {
      redirectPath = "/provider/dashboard"
    }

    return {
      success: true,
      message: "Registration successful!",
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      redirectPath,
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getUserSession() {
  const sessionCookie = cookies().get("user-session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function logout() {
  cookies().delete("user-session")
  return { success: true }
}

