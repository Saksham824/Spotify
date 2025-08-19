import { ChevronLeft, Search, X } from "lucide-react";

export default function TopBar({ searchQuery, setSearchQuery }) {
  return (
    <header className="w-full bg-gradient-to-b from-[#1DB954]/30 to-transparent px-3 py-3 md:px-6 md:py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Top row: Back button and right buttons */}
      <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4">
        {/* Back button */}
        <button
          className="bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
          aria-label="Go Back"
        >
          <ChevronLeft size={22} className="text-white" />
        </button>

        {/* On mobile, right button is here */}
        <div className="md:hidden">
          <button className="bg-gray-800 px-3 py-1 rounded-full text-white text-xs font-medium hover:bg-gray-700 transition">
            GitHub
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="w-full md:max-w-md mx-auto md:mx-6">
        <div className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-2 md:py-3 shadow focus-within:ring-2 focus-within:ring-[#1DB954]/50 transition">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder-gray-400"
            aria-label="Search"
          />
          {searchQuery && (
            <X
              size={18}
              className="text-gray-400 ml-2 cursor-pointer hover:text-white transition"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              tabIndex={0}
              role="button"
            />
          )}
        </div>
      </div>

      {/* Right side buttons (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-4">
        <button className="bg-gray-800 px-4 py-1.5 rounded-full text-white text-sm font-medium hover:bg-gray-700 transition">
          GitHub
        </button>
      </div>
    </header>
  );
}