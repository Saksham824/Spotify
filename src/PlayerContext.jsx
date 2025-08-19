import { createContext, useState, useEffect } from "react";

export const PlayerContext = createContext();

export default function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(
    () => JSON.parse(localStorage.getItem("currentTrack")) || null
  );
  const [recentSongs, setRecentSongs] = useState(
    () => JSON.parse(localStorage.getItem("recentSongs")) || []
  );

  // save current track
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  // save history
  useEffect(() => {
    localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
  }, [recentSongs]);

  // function to play a track
  const playTrack = (track) => {
    setCurrentTrack(track);

    // avoid duplicates in recent
    setRecentSongs((prev) => {
      const updated = [track, ...prev.filter((t) => t.id !== track.id)];
      return updated.slice(0, 10);
    });
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, playTrack, recentSongs }}>
      {children}
    </PlayerContext.Provider>
  );
}
//