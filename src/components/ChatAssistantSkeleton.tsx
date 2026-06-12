import React from "react";

export default function ChatAssistantSkeleton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-14 h-14 rounded-full border-2 border-[#de7c8a] flex items-center justify-center bg-[#511B29] relative shadow-lg">
        {/* Placeholder for the user avatar image */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#511B29] flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 rounded-full bg-white/20" />
        </div>
        {/* Online Status Indicator placeholder */}
        <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 z-30" />
      </div>
    </div>
  );
}
