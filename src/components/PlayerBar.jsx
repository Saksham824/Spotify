import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PlayerBar({ track, playlist = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(false);

  // 🔑 Local track state (so we can update cover/title when random song plays)
  const [currentTrack, setCurrentTrack] = useState(track || null);

  const audioRef = useRef(null);

  // Load new track when "track" prop changes
  useEffect(() => {
    if (track) {
      setCurrentTrack(track);
    }
  }, [track]);

  // Play currentTrack
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.loop = isLooping;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [currentTrack, isLooping]);

  // Progress update
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
      audioRef.current?.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  // Handle when song ends → play random next
  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => handleNext();
    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [playlist]);

  // ▶️ / ⏸ toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // ⏩ Next → random song
  const handleNext = () => {
    if (!playlist || playlist.length === 0) return;
    const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
    setCurrentTrack(randomSong); // ✅ update metadata
  };

  // ⏪ Previous → restart or random
  const handlePrev = () => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      handleNext();
    }
  };

  // Volume
  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Loop
  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 h-24 px-4 sm:px-6 flex items-center justify-between text-white flex-col sm:flex-row">
      {/* Audio element */}
      <audio ref={audioRef} />

      {/* Left - Info */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-1/4 mb-3 sm:mb-0">
        <img
          src={currentTrack?.image || "/fallback.jpg"}
          alt={currentTrack?.title || "cover"}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover"
        />
        <div className="truncate">
          <h3 className="font-medium text-sm sm:text-base truncate">
            {currentTrack?.title || "No Song Playing"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {currentTrack?.subtitle || ""}
          </p>
        </div>
      </div>

      {/* Middle - Controls */}
      <div className="flex flex-col items-center w-full sm:w-2/4">
        <div className="flex items-center gap-4 sm:gap-6 mb-2">
          <Shuffle
            size={18}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={handleNext} // 🔀 Shuffle triggers random
          />
          <SkipBack
            size={22}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={handlePrev}
          />
          <button
            className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
            onClick={togglePlay}
            disabled={!currentTrack?.audio}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <SkipForward
            size={22}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={handleNext}
          />
          <Repeat
            size={18}
            onClick={toggleLoop}
            className={`cursor-pointer ${
              isLooping ? "text-green-400" : "text-gray-400 hover:text-white"
            }`}
          />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-xs text-gray-400 w-full px-4 sm:px-10">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="1"
            value={progress}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              audioRef.current.currentTime = newTime;
              setProgress(newTime);
            }}
            className="flex-1 accent-white cursor-pointer"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right - Volume */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-1/4 justify-center sm:justify-end mt-3 sm:mt-0">
        <Volume2 size={20} className="text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-24 accent-white cursor-pointer"
        />
      </div>
    </div>
  );
}
