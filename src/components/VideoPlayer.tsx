"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
  lessonId: string;
  initialPosition: number;
}

export default function VideoPlayer({
  url,
  lessonId,
  initialPosition,
}: VideoPlayerProps) {
  const [hasWindow, setHasWindow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const lastSavedPosition = useRef(initialPosition);

  useEffect(() => {
    setHasWindow(true);
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    // Simpan posisi setiap 5 detik agar tidak terlalu sering membebani server
    if (Math.abs(state.playedSeconds - lastSavedPosition.current) > 5) {
      lastSavedPosition.current = state.playedSeconds;
      savePosition(state.playedSeconds);
    }
  };

  const savePosition = async (position: number) => {
    try {
      await fetch("/api/progress/update-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, lastPosition: position }),
      });
    } catch (error) {
      console.error("Failed to save position", error);
    }
  };

  const handleOnReady = () => {
    if (initialPosition > 0 && playerRef.current) {
      playerRef.current.seekTo(initialPosition, "seconds");
    }
  };

  if (!hasWindow)
    return <div className="aspect-video bg-black rounded-xl animate-pulse" />;

  return (
    <div className="aspect-video bg-black rounded-xl mb-8 overflow-hidden shadow-2xl relative">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(() => {
        const RP = ReactPlayer as any;
        return (
          <RP
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            controls
            onProgress={handleProgress}
            onReady={handleOnReady}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
          />
        );
      })()}
    </div>
  );
}
