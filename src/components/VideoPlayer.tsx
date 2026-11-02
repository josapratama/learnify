"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { PlayCircle, RotateCcw } from "lucide-react";

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
  const hasSeeked = useRef(false);
  const [showResumeNotice, setShowResumeNotice] = useState(initialPosition > 10);

  useEffect(() => {
    setHasWindow(true);
  }, []);

  // Auto-hide the resume toast after 5 seconds
  useEffect(() => {
    if (showResumeNotice) {
      const timer = setTimeout(() => setShowResumeNotice(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showResumeNotice]);

  const handleProgress = (state: { playedSeconds: number }) => {
    // Save position every 5 seconds
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

  const performSeek = (pos: number) => {
    if (playerRef.current && pos > 0) {
      try {
        playerRef.current.seekTo(pos, "seconds");
        hasSeeked.current = true;
      } catch (err) {
        console.warn("Seek attempt waiting for player readiness:", err);
      }
    }
  };

  const handleOnReady = () => {
    if (initialPosition > 0 && !hasSeeked.current) {
      performSeek(initialPosition);
      // Fallback delay check for YouTube iframe initialization
      setTimeout(() => {
        performSeek(initialPosition);
      }, 600);
    }
  };

  const handleOnStart = () => {
    if (initialPosition > 0 && !hasSeeked.current) {
      performSeek(initialPosition);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleRestartFromBeginning = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds");
      setShowResumeNotice(false);
    }
  };

  if (!hasWindow)
    return <div className="aspect-video bg-black rounded-xl animate-pulse" />;

  return (
    <div className="aspect-video bg-black rounded-xl mb-8 overflow-hidden shadow-2xl relative group">
      {/* Resume notification pill */}
      {showResumeNotice && initialPosition > 10 && (
        <div className="absolute top-4 left-4 z-20 bg-gray-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/20 shadow-xl transition animate-in fade-in slide-in-from-top-2">
          <PlayCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Melanjutkan dari <strong className="text-blue-300">{formatTime(initialPosition)}</strong>
          </span>
          <button
            onClick={handleRestartFromBeginning}
            className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" /> Ulangi
          </button>
        </div>
      )}

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
            onStart={handleOnStart}
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
