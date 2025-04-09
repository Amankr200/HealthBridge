"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { Peer } from "peerjs"

interface PeerVideoCallProps {
  appointmentId: string
  role: 'doctor' | 'patient'
  onEndCall: () => void
}

export function PeerVideoCall({ appointmentId, role, onEndCall }: PeerVideoCallProps) {
  const [peerId, setPeerId] = useState<string>("")
  const [remotePeerId, setRemotePeerId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const peerInstance = useRef<Peer | null>(null)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const myStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const initializePeer = async () => {
      try {
        setIsConnecting(true)
        setError(null)

        // Initialize PeerJS with STUN/TURN servers for better connectivity
        const peer = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        })
        peerInstance.current = peer

        peer.on('open', async (id) => {
          console.log('My peer ID is:', id)
          setPeerId(id)

          // Get local media stream
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }, 
              audio: true 
            })
            myStreamRef.current = stream
            
            // Ensure video element exists and set srcObject
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream
              // Ensure video plays
              const playPromise = myVideoRef.current.play()
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Video play failed:", error)
                })
              }
            }

            // If we're the patient, send the peer ID to the server
            if (role === 'patient') {
              await fetch('/api/notifications/send-peer-id', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  appointmentId,
                  peerId: id
                }),
              })
            }
            // If we're the doctor, get the patient's peer ID
            else if (role === 'doctor') {
              const response = await fetch(`/api/notifications/get-peer-id?appointmentId=${appointmentId}`)
              if (response.ok) {
                const { peerId: patientPeerId } = await response.json()
                setRemotePeerId(patientPeerId)
                // Automatically call the patient
                if (patientPeerId && myStreamRef.current) {
                  const call = peer.call(patientPeerId, myStreamRef.current)
                  handleCall(call)
                }
              }
            }

            setIsConnecting(false)
          } catch (err: any) {
            console.error('Failed to get media devices:', err)
            setError('Failed to access camera/microphone. Please check your permissions.')
            setIsConnecting(false)
          }
        })

        // Handle incoming calls
        peer.on('call', async (call) => {
          try {
            // Ensure we have local stream before answering
            if (!myStreamRef.current) {
              const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }, 
                audio: true 
              })
              myStreamRef.current = stream
              if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream
              }
            }
            
            call.answer(myStreamRef.current)
            handleCall(call)
          } catch (err) {
            console.error('Error answering call:', err)
            setError('Failed to establish video call connection')
          }
        })

        peer.on('error', (err) => {
          console.error('PeerJS error:', err)
          setError('Connection error. Please try again.')
          setIsConnecting(false)
        })

        return () => {
          if (myStreamRef.current) {
            myStreamRef.current.getTracks().forEach(track => track.stop())
          }
          peer.destroy()
        }
      } catch (err: any) {
        console.error('Failed to initialize peer:', err)
        setError(err.message || 'Failed to initialize video call')
        setIsConnecting(false)
      }
    }

    initializePeer()
  }, [appointmentId, role])

  const handleCall = (call: any) => {
    call.on('stream', (remoteStream: MediaStream) => {
      console.log('Received remote stream')
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream
        // Ensure remote video plays
        const playPromise = remoteVideoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Remote video play failed:", error)
          })
        }
      }
    })

    call.on('close', () => {
      console.log('Call closed')
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }
    })

    call.on('error', (err: any) => {
      console.error('Call error:', err)
      setError('Video call connection error')
    })
  }

  const toggleMute = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndCall = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerInstance.current) {
      peerInstance.current.destroy()
    }
    onEndCall()
  }

  if (isConnecting) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="text-lg text-muted-foreground">Connecting to video call...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleEndCall}>
            Back to Appointments
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            You {isVideoOff && "(Video Off)"}
          </div>
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800 rounded-full p-4">
                <VideoOff size={48} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            {role === 'doctor' ? 'Patient' : 'Doctor'}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant={isMuted ? "outline" : "default"}
          onClick={toggleMute}
          className="gap-2"
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button
          variant={isVideoOff ? "outline" : "default"}
          onClick={toggleVideo}
          className="gap-2"
        >
          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          {isVideoOff ? "Start Video" : "Stop Video"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleEndCall}
          className="gap-2"
        >
          <PhoneOff className="h-4 w-4" />
          End Call
        </Button>
      </div>
    </Card>
  )
} 