import { useEffect, useState, useContext } from "react";
import PlayerBar from "./components/PlayerBar";
import Section from "./components/Section";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { PlayerContext } from "./PlayerContext";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //  Get track + history from context
  const { currentTrack, playTrack } = useContext(PlayerContext);

  // Fetch tracks
  useEffect(() => {
    async function fetchTracks() {
      try {
        const query = searchQuery || "punjabi";
        const res = await fetch(
          `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`
        );
        const json = await res.json();

        if (json.success) {
          setTracks(json.data.results.slice(0, 20));
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error("Error fetching tracks:", err);
      }
    }
    fetchTracks();
  }, [searchQuery]);

  const items = tracks.map((t) => {
    let img =
      t.image?.[2]?.url ||
      t.image?.[1]?.url ||
      t.image?.[0]?.url ||
      "/fallback.jpg";

    return {
      id: t.id,
      image: img,
      title: t.name || t.title,
      subtitle:
        t.primaryArtists ||
        (t.artists?.primary?.map((a) => a.name).join(", ") || "Unknown Artist"),
      audio: t.downloadUrl?.[2]?.url || t.downloadUrl?.[1]?.url || null,
    };
  });

  return (
    <div className="flex h-screen bg-black text-white overflow-y-scroll">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Greeting & Featured Tracks */}
        <section className="px-3 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "Welcome User"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {items.slice(0, 6).map((p, i) => (
              <div
                key={i}
                onClick={() => playTrack(p)}
                className="flex items-center gap-4 bg-[#232323] rounded-xl hover:bg-[#2a2a2a] transition shadow cursor-pointer p-3 group"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shadow group-hover:scale-105 transition"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-base truncate max-w-[120px] sm:max-w-[160px]">
                    {p.title}
                  </span>
                  <span className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[160px]">
                    {p.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Made for you */}
        <Section title="Made for you" items={items} onPlay={playTrack} />

        {/* Spacer for player bar */}
        <div className="h-24 md:h-28" />
      </main>

      {/* PlayerBar: fixed at bottom, full width */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <PlayerBar track={currentTrack} playlist={items} />

      </div>
    </div>
  );
}