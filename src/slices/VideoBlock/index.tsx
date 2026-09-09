'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import Image from 'next/image';

export interface VideoBlockSliceDefaultPrimary {
  video_file?: {
    url?: string;
    kind?: string;
    name?: string;
    size?: string;
  } | null;
  video_url?: string | null;
  video_embed?: {
    embed_url?: string;
    html?: string;
    type?: string;
    provider_name?: string;
    title?: string;
  } | null;
  poster_image?: {
    url?: string;
    alt?: string | null;
  } | null;
  widget_title?: string | null;
  widget_icon?: string | null;
  caption?: string | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
  controls?: boolean | null;
}

export interface VideoBlockSlice {
  slice_type: "video_block";
  variation?: string;
  primary: VideoBlockSliceDefaultPrimary;
}

export type VideoBlockProps = {
  slice: VideoBlockSlice;
  context?: {
    isEmbedded?: boolean;
    isBottom?: boolean;
    [key: string]: any;
  };
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
  }
} as const;

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * (standard watch, shortened youtu.be, shorts, or embed links)
 */
function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VideoBlock({ slice, context }: VideoBlockProps) {
  const { primary } = slice;
  const isEmbedded = context?.isEmbedded === true;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(primary?.autoplay ?? true);
  const [isMuted, setIsMuted] = useState<boolean>(primary?.muted ?? true);

  // Check for potential YouTube source in embed or direct URL fields
  const embedUrl = primary?.video_embed?.embed_url || '';
  const directUrl = primary?.video_url || '';
  const fileUrl = primary?.video_file?.url || '';

  const youtubeId = extractYouTubeId(embedUrl) || extractYouTubeId(directUrl) || extractYouTubeId(fileUrl);

  // Fallback video source (local/CDN WebM or MP4 file)
  const videoSrc = !youtubeId ? (fileUrl || directUrl) : '';
  const posterSrc = primary?.poster_image?.url || '';
  const showNativeControls = primary?.controls === true;
  const shouldAutoPlay = primary?.autoplay ?? true;
  const shouldLoop = primary?.loop ?? true;

  // Detect mime type if possible from file extension
  const isWebm = videoSrc.toLowerCase().includes('.webm');
  const isMp4 = videoSrc.toLowerCase().includes('.mp4');

  // Handle HTML5 video autoplay safely on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || youtubeId) return;

    if (shouldAutoPlay) {
      video.muted = isMuted;
      video.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoSrc, shouldAutoPlay, isMuted, youtubeId]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Convert icon name to PascalCase for Lucide lookup
  const toPascalCase = (str: string) => {
    return str
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  };

  const iconName = primary?.widget_icon ? toPascalCase(primary.widget_icon.trim()) : 'Video';
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Video;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className={isEmbedded ? "space-y-4" : "max-w-7xl mx-auto px-6 space-y-4"}
    >
      {/* Optional Widget Title Header (styled like other sidebar widgets) */}
      {primary?.widget_title && (
        <div className="bg-white border border-[#efedec] rounded-2xl px-5 py-3.5 shadow-sm">
          <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-[#de7c8a]" />
            {primary.widget_title}
          </h3>
        </div>
      )}

      {/* Video Container matching WidgetBlock Image format, aspect-ratio, and 24px rounded corners */}
      <div 
        className="group relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm hover:shadow-xl transition-shadow duration-300 [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)]"
        onClick={!youtubeId && !showNativeControls ? togglePlay : undefined}
      >
        {youtubeId ? (
          /* YouTube Privacy-Enhanced Embed */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${shouldAutoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=${shouldLoop ? 1 : 0}&playlist=${youtubeId}&controls=${showNativeControls ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
            title={primary?.widget_title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 object-cover rounded-3xl"
          />
        ) : videoSrc ? (
          /* Native HTML5 Video (WebM / MP4) */
          <>
            <video
              ref={videoRef}
              autoPlay={shouldAutoPlay}
              loop={shouldLoop}
              muted={isMuted}
              playsInline
              controls={showNativeControls}
              poster={posterSrc || undefined}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover select-none cursor-pointer rounded-3xl"
            >
              {isWebm && <source src={videoSrc} type="video/webm" />}
              {isMp4 && <source src={videoSrc} type="video/mp4" />}
              <source src={videoSrc} />
              Your browser does not support HTML5 video.
            </video>

            {/* Custom Floating Controls for WebM/MP4 (visible on hover when native controls are disabled) */}
            {!showNativeControls && (
              <>
                {/* Center Play/Pause indicator on pause or hover */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                    !isPlaying ? 'opacity-100 bg-black/20' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-[#511B29] transition-transform duration-200 group-hover:scale-110">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </div>
                </div>

                {/* Bottom Bar: Sound Toggle */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 transition-opacity duration-300 opacity-90 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Ieslēgt skaņu" : "Izslēgt skaņu"}
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}
          </>
        ) : posterSrc ? (
          /* Fallback Poster Image */
          <Image
            src={posterSrc}
            alt={primary?.poster_image?.alt || primary?.widget_title || "Video preview"}
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="object-cover select-none rounded-3xl"
          />
        ) : (
          /* Placeholder in Prismic when no source is selected */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50 p-6 text-center">
            <LucideIcons.Video className="w-8 h-8 text-[#de7c8a] opacity-80" />
            <span className="text-xs font-medium text-slate-500">VideoBlock (YouTube, WebM vai MP4 video)</span>
          </div>
        )}
      </div>

      {/* Optional Caption */}
      {primary?.caption && (
        <p className="text-xs text-[#6a5b5e] px-1 italic">
          {primary.caption}
        </p>
      )}
    </motion.div>
  );
}
