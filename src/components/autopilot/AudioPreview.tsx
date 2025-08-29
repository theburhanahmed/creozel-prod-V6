import React, { useEffect, useState, useRef } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface AudioPreviewProps {
  audioSrc?: string;
  text: string;
  voiceName: string;
  language: string;
  isLoading?: boolean;
}
export const AudioPreview = ({
  audioSrc,
  text,
  voiceName,
  language,
  isLoading = false
}: AudioPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Reset state when audio source changes
    setIsPlaying(false);
    setProgress(0);
    // Create audio element if not exists
    if (!audioRef.current && audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
    } else if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
      }
    };
  }, [audioSrc]);
  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    } else {
      audioRef.current.play();
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const currentProgress = audioRef.current.currentTime / audioRef.current.duration * 100;
          setProgress(currentProgress);
          if (audioRef.current.ended) {
            setIsPlaying(false);
            setProgress(0);
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
              progressInterval.current = null;
            }
          }
        }
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioSrc) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const clickPercentage = clickPosition / progressBarWidth * 100;
    setProgress(clickPercentage);
    audioRef.current.currentTime = clickPercentage / 100 * audioRef.current.duration;
  };
  return <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Button variant={isPlaying ? 'danger' : 'primary'} size="sm" className="!p-2 h-10 w-10 rounded-full" onClick={togglePlay} disabled={!audioSrc || isLoading}>
            {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" /> : isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </Button>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {voiceName} • {language}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {text.length > 60 ? text.substring(0, 60) + '...' : text}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="!p-1" onClick={toggleMute} disabled={!audioSrc}>
              {isMuted ? <VolumeXIcon size={16} /> : <Volume2Icon size={16} />}
            </Button>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer" onClick={handleProgressClick}>
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all" style={{
              width: `${progress}%`
            }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(progress / 100 * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
