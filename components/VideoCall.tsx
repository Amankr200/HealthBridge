'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Video, Loader2, User, Mic, MicOff, VideoOff, AlertCircle } from 'lucide-react';

const LoadingState = ({ message, submessage }: { message: string; submessage: string }) => (
  <div className="absolute inset-0 bg-[#0f1116] flex flex-col items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-white/50 animate-spin mx-auto mb-2" />
      <p className="text-white/70 text-sm">{message}</p>
    </div>
  </div>
);

export default function VideoCall() {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoInitialized, setIsVideoInitialized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  const checkMediaPermissions = async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support video calls. Please use a modern browser.');
      }

      // Check if we're on HTTPS or localhost
      if (typeof window !== 'undefined' && 
          window.location.protocol !== 'https:' && 
          window.location.hostname !== 'localhost') {
        throw new Error('Video calls require a secure connection (HTTPS).');
      }

      // Check if the device has a camera
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      if (!hasCamera) {
        throw new Error('No camera detected. Please connect a camera and try again.');
      }

      return true;
    } catch (err) {
      console.error('Media permissions check failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera.');
      return false;
    }
  };

  const startVideo = async () => {
    try {
      setError(null);
      
      const permissionsOk = await checkMediaPermissions();
      if (!permissionsOk) return;

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error('Video play failed:', e);
            setError('Failed to play video stream. Please try again.');
          });
        };
        setIsVideoInitialized(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access denied. Please grant camera permissions and try again.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is in use by another application. Please close other apps using the camera.');
        } else {
          setError('Failed to access camera. Please check your camera settings and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsVideoInitialized(false);
    }
  };

  useEffect(() => {
    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsVideoInitialized(false);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleWaiting = () => {
    setIsWaiting(!isWaiting);
  };

  const PatientView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Patient's video */}
        <div className="relative aspect-video bg-[#0f1116] rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
              You
            </p>
          </div>
        </div>
        {/* Doctor's video/waiting area */}
        <div className="relative aspect-video bg-[#0f1116] rounded-lg overflow-hidden">
          {isWaiting ? (
            <LoadingState 
              message="Waiting for doctor to join..."
              submessage=""
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <User className="w-16 h-16 text-white/20 mb-2" />
              <p className="text-white/70 text-sm font-medium">Doctor's Camera Off</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-white/10 border-0 hover:bg-white/20"
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-white/10 border-0 hover:bg-white/20"
          onClick={startVideo}
        >
          <Video className="h-5 w-5 text-white" />
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={toggleWaiting}
          className="rounded-full px-8"
        >
          End Call
        </Button>
      </div>
    </div>
  );

  const DoctorView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Doctor's video */}
        <div className="relative aspect-video bg-[#0f1116] rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
              You
            </p>
          </div>
        </div>
        {/* Patient's video/waiting area */}
        <div className="relative aspect-video bg-[#0f1116] rounded-lg overflow-hidden">
          {isWaiting ? (
            <LoadingState 
              message="Waiting for patient to join..."
              submessage=""
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <User className="w-16 h-16 text-white/20 mb-2" />
              <p className="text-white/70 text-sm font-medium">Patient's Camera Off</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-white/10 border-0 hover:bg-white/20"
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-white/10 border-0 hover:bg-white/20"
          onClick={startVideo}
        >
          <Video className="h-5 w-5 text-white" />
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={toggleWaiting}
          className="rounded-full px-8"
        >
          End Call
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="border-0 shadow-lg bg-[#0f1116]">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Video className="w-6 h-6" />
              {isDoctor ? 'Doctor Dashboard' : 'Patient Video Call'}
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => setIsDoctor(!isDoctor)}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <User className="w-4 h-4" />
              Switch to {isDoctor ? 'Patient' : 'Doctor'} View
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error ? (
            <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-medium mb-1">Camera Access Error</h3>
                  <p className="text-red-400/90 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4 text-white border-white/20 hover:bg-white/10"
                    onClick={startVideo}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            isDoctor ? <DoctorView /> : <PatientView />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 