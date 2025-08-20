import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PlayerBar({ track, playlist = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(false);

  // Local track state
  const [currentTrack, setCurrentTrack] = useState(track || null);
  const [isExpanded, setIsExpanded] = useState(false); 

  const audioRef = useRef(null);

  // Load new track when prop changes
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

  // Progress
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

  // Handle ended → random next
  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => handleNext();
    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [playlist]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist || playlist.length === 0) return;
    const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
    setCurrentTrack(randomSong);
  };

  const handlePrev = () => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      handleNext();
    }
  };

  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  //  Hide Playbar until a song is selected
  if (!currentTrack) return null;

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} />

      {/* --- Desktop Playbar --- */}
      <div className="hidden sm:flex fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 h-24 px-6 items-center justify-between text-white">
        {/* Left - Info */}
        <div className="flex items-center gap-4 w-1/4">
          <img
            src={currentTrack?.image || "/fallback.jpg"}
            alt={currentTrack?.title || "cover"}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div className="truncate">
            <h3 className="font-medium text-base truncate">
              {currentTrack?.title || "No Song Playing"}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {currentTrack?.subtitle || ""}
            </p>
          </div>
        </div>

        {/* Middle - Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <Shuffle
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={handleNext}
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
                isLooping
                  ? "text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 w-full px-10">
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
        <div className="flex items-center gap-3 w-1/4 justify-end">
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

      {/* --- Mobile Mini Playbar --- */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#181818] to-[#282828] border-t border-[#282828] h-16 px-4 flex items-center gap-3 text-white cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <img
          src={currentTrack?.image || "/fallback.jpg"}
          alt={currentTrack?.title || "cover"}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="flex-1 truncate">
          <h3 className="font-medium text-sm truncate">
            {currentTrack?.title || "No Song"}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack?.subtitle || ""}
          </p>
        </div>
        <button
          className="bg-white text-black rounded-full p-2"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* --- Fullscreen Mobile Player --- */}
      {isExpanded && (
        <div className="fixed inset-0 bg-gradient-to-t from-[#181818] to-[#282828] border-t border-[#282828] flex flex-col items-center text-white z-50 p-6">
          {/* Close */}
          <button
            onClick={() => setIsExpanded(false)}
            className="self-end mb-4 text-gray-400 hover:text-white"
          >
            <X size={28} />
          </button>

          {/* Cover */}
          <img
            src={currentTrack?.image || "/fallback.jpg"}
            alt={currentTrack?.title}
            className="w-72 h-72 rounded-lg mb-6 object-cover"
          />

          {/* Info */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{currentTrack?.title}</h2>
            <p className="text-gray-400">{currentTrack?.subtitle}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 text-xs text-gray-400 w-full px-2 mb-6">
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Shuffle
              size={22}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={handleNext}
            />
            <SkipBack
              size={28}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={handlePrev}
            />
            <button
              className="bg-white text-black rounded-full p-5 hover:scale-105 transition"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <SkipForward
              size={28}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={handleNext}
            />
            <Repeat
              size={22}
              onClick={toggleLoop}
              className={`cursor-pointer ${
                isLooping
                  ? "text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            />
          </div>

          {/* Right - Volume */}
          <div className="flex items-center gap-2 mt-5 ">
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
      )}
    </>
  );
}
