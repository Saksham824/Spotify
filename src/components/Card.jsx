import { Play } from "lucide-react";

export default function Card({ image, title, subtitle, audio, onPlay }) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Play ${title || "Unknown Title"}`}
      onClick={(e) => {
        e.stopPropagation();
        onPlay?.({ image, title, subtitle, audio });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlay?.({ image, title, subtitle, audio });
        }
      }}
      className="bg-[#181818] rounded-xl p-3 sm:p-4 hover:bg-[#232323] transition cursor-pointer group relative shadow
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#181818]
        hover:shadow-xl active:scale-[0.98] duration-200"
    >
      {/* Image wrapper with play button */}
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-lg transition group-hover:scale-105"
          onError={(e) => (e.target.src = "/fallback.jpg")}
          draggable={false}
        />

        {/* Play button (click sets current track) */}
        <button
          tabIndex={-1}
          className="absolute bottom-3 right-3 bg-green-500 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
            translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0
            transition-all duration-300 shadow-lg "
        >
          <Play size={22} fill="black" stroke="black" />
        </button>
      </div>

      {/* Title & Subtitle */}
      <h3 className="mt-3 text-white font-semibold text-base md:text-lg truncate" title={title}>
        {title || "Unknown Title"}
      </h3>
      <p className="text-gray-400 text-xs md:text-sm truncate" title={subtitle}>
        {subtitle || "Unknown Artist"}
      </p>
    </div>
  );
}