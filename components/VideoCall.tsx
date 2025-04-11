'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Video, Loader2, User, Mic, MicOff, VideoOff } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please make sure you have granted camera permissions.');
    }
  };

  useEffect(() => {
    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
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
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-red-400">{error}</p>
              <Button
                variant="outline"
                className="mt-2 text-white border-white/20 hover:bg-white/10"
                onClick={startVideo}
              >
                Try Again
              </Button>
            </div>
          ) : (
            isDoctor ? <DoctorView /> : <PatientView />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 