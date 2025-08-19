import { useContext, useState } from "react";
import { Home, Menu } from "lucide-react";
import logo from "../assets/spotify.png";
import { Link } from "react-router-dom";
import { PlayerContext } from "../PlayerContext";

export default function Sidebar() {
  const { recentSongs, playTrack } = useContext(PlayerContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black/80 p-2 rounded-full"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-black
          text-white transition-transform duration-300
          w-64 p-4 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-auto md:w-64 md:p-6
        `}
      >
        {/* Logo and Navigation */}
        <div className="flex flex-col md:items-start">
          <img
            className="w-32 mb-8"
            src={logo}
            alt="Spotify"
            draggable={false}
          />
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-300 hover:text-white font-semibold text-lg transition"
            onClick={() => setOpen(false)}
          >
            <Home size={22} /> Home
          </Link>
        </div>

        {/* Recent Songs */}
        <div className="mt-10 flex-1 flex flex-col">
          <h2 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-widest">
            Recent Songs
          </h2>
          <ul className="space-y-2 overflow-y-auto pr-2 max-h-[calc(100vh-220px)]">
            {recentSongs.length === 0 && (
              <li className="text-gray-500 text-sm">No recent songs</li>
            )}
            {recentSongs.map((song) => (
              <li
                key={song.id}
                onClick={() => {
                  playTrack(song);
                  setOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/60 p-2 rounded-lg transition group"
              >
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-12 h-12 rounded shadow-md group-hover:scale-105 transition"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-100 truncate max-w-[120px]">
                    {song.title}
                  </span>
                  <span className="text-xs text-gray-400 truncate max-w-[120px]">
                    {song.subtitle}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}