import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Timer } from "lucide-react";

const Meditation = ({ isGuestMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("forest");
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(10 * 60); // seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const breathingCircleRef = useRef(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const sounds = [
    { id: "forest", name: "Forest Sounds", emoji: "🌲", description: "Birds chirping with gentle wind" },
    { id: "rain", name: "Gentle Rain", emoji: "🌧️", description: "Soft rainfall on leaves" },
    { id: "ocean", name: "Ocean Waves", emoji: "🌊", description: "Rhythmic waves on shore" },
    { id: "silence", name: "Pure Silence", emoji: "🤫", description: "Complete quiet for focus" },
  ];

  const durations = [5, 10, 15, 20, 30];

  // Audio file paths
  const soundFiles = {
    forest: '/sounds/forest.mp3',
    rain: '/sounds/rain.mp3',
    ocean: '/sounds/ocean.mp3'
  };

  // Get background styles based on current sound
  const getBackgroundStyles = () => {
    switch (currentSound) {
      case 'rain':
        return {
          containerClass: 'min-h-screen w-full bg-white relative overflow-hidden',
          backgroundElement: (
            <div 
              className="absolute inset-0 z-0 pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(circle at center, #93c5fd, transparent)`,
              }} 
            />
          )
        };
      case 'ocean':
        return {
          containerClass: 'min-h-screen w-full bg-white relative overflow-hidden',
          backgroundElement: (
            <div 
              className="absolute inset-0 z-0 pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(circle at center, #93c5fd, transparent)`,
              }} 
            />
          )
        };
      case 'forest':
        return {
          containerClass: 'min-h-screen w-full bg-white relative',
          backgroundElement: (
            <div 
              className="absolute inset-0 z-0 pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(circle at center, #10b981, transparent)`,
              }} 
            />
          )
        };
      default: // silence
        return {
          containerClass: 'min-h-screen w-full bg-[#f5f5dc] relative',
          backgroundElement: (
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(180deg, 
                    rgba(245,245,220,1) 0%, 
                    rgba(255,223,186,0.8) 25%, 
                    rgba(255,182,193,0.6) 50%, 
                    rgba(147,112,219,0.7) 75%, 
                    rgba(72,61,139,0.9) 100%
                  ),
                  radial-gradient(circle at 30% 20%, rgba(255,255,224,0.4) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(72,61,139,0.6) 0%, transparent 70%),
                  radial-gradient(circle at 50% 60%, rgba(147,112,219,0.3) 0%, transparent 60%)
                `,
              }}
            />
          )
        };
    }
  };

  // Sound management with HTML5 audio
  useEffect(() => {
    if (isPlaying && currentSound !== 'silence') {
      const audio = new Audio(soundFiles[currentSound]);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;
      
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
      
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [isPlaying, currentSound]);

  // Update volume when volume or mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Breathing animation effect
  useEffect(() => {
    if (isPlaying && breathingCircleRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(breathingCircleRef.current, {
        scale: 1.3,
        duration: 4,
        ease: "power2.inOut"
      })
      .to(breathingCircleRef.current, {
        scale: 1,
        duration: 4,
        ease: "power2.inOut"
      });
      
      return () => {
        tl.kill();
      };
    }
  }, [isPlaying]);

  // Timer functionality
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsTimerActive(false);
    setIsPlaying(false);
    
    // Celebration effect
    if (breathingCircleRef.current) {
      gsap.from(breathingCircleRef.current, {
        scale: 1.5,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      });
    }
    
    alert("🧘‍♀️ Meditation session complete! Great job!");
  };

  const startMeditation = () => {
    setIsPlaying(true);
    setIsTimerActive(true);
    setTimeLeft(sessionTime * 60);
  };

  const pauseMeditation = () => {
    setIsPlaying(false);
    setIsTimerActive(false);
  };

  const resetMeditation = () => {
    setIsPlaying(false);
    setIsTimerActive(false);
    setTimeLeft(sessionTime * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const changeSessionTime = (minutes) => {
    if (!isTimerActive) {
      setSessionTime(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const handleSoundChange = (soundId) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    setCurrentSound(soundId);
  };

  const backgroundStyles = getBackgroundStyles();

  return (
    <div className={backgroundStyles.containerClass}>
      {/* Dynamic Background */}
      {backgroundStyles.backgroundElement}

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-white">Mindful Meditation</h2>
            <p className="text-white/80">
              Find your inner peace with guided breathing and natural sounds
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Meditation Area */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 text-center bg-white/10 backdrop-blur-md border-white/20">
                {/* Breathing Circle */}
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <div
                    ref={breathingCircleRef}
                    className="w-full h-full rounded-full bg-gradient-meditation/20 border-4 border-white/30 flex items-center justify-center shadow-meditation"
                  >
                    <div className="text-center text-white">
                      <div className="text-4xl font-bold mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-lg opacity-80">
                        {isPlaying ? "Breathe deeply" : "Ready to begin?"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Breathing Guide */}
                  {isPlaying && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center">
                        <div className="mb-1">Inhale for 4 seconds</div>
                        <div>Exhale for 4 seconds</div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4 mb-6">
                  {!isPlaying ? (
                    <Button
                      variant="meditation"
                      size="lg"
                      onClick={startMeditation}
                      className="min-w-32"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={pauseMeditation}
                      className="min-w-32 bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetMeditation}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Session Duration */}
                <div className="mb-6">
                  <div className="text-white/80 text-sm mb-3">Session Duration</div>
                  <div className="flex justify-center space-x-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration}
                        variant={sessionTime === duration ? 'meditation' : 'outline'}
                        size="sm"
                        onClick={() => changeSessionTime(duration)}
                        disabled={isTimerActive}
                        className={sessionTime === duration ? '' : 'bg-white/10 border-white/30 text-white hover:bg-white/20'}
                      >
                        {duration}m
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-meditation to-purple-400 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${((sessionTime * 60 - timeLeft) / (sessionTime * 60)) * 100}%` 
                    }}
                  />
                </div>
                
                <div className="text-white/60 text-sm">
                  {Math.round(((sessionTime * 60 - timeLeft) / (sessionTime * 60)) * 100)}% Complete
                </div>
              </Card>
            </motion.div>

            {/* Controls & Settings */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Sound Selection */}
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-white">Ambient Sounds</h3>
                <div className="space-y-3">
                  {sounds.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundChange(sound.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        currentSound === sound.id
                          ? 'bg-white/20 border-2 border-white/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{sound.emoji}</span>
                        <div>
                          <div className="text-white font-medium">{sound.name}</div>
                          <div className="text-white/60 text-sm">{sound.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Volume Control */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm">Volume</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </Card>

              {/* Meditation Stats */}
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-white">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Sessions today</span>
                    <span className="text-white font-semibold">
                      {isGuestMode ? "Sign in to track" : "2"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Total minutes</span>
                    <span className="text-white font-semibold">
                      {isGuestMode ? "Sign in to track" : "45"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Streak</span>
                    <span className="text-white font-semibold">
                      {isGuestMode ? "Sign in to track" : "7 days"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Tips */}
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  🧘‍♀️ Meditation Tips
                </h3>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Find a comfortable, quiet position</li>
                  <li>• Focus on your breath rhythm</li>
                  <li>• It's okay if your mind wanders</li>
                  <li>• Start with short sessions</li>
                  <li>• Practice consistently daily</li>
                </ul>
              </Card>

              {isGuestMode && (
                <Card className="p-6 bg-gradient-zen/20 border-primary/30 backdrop-blur-md">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Track Your Journey
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Sign in to save your meditation progress and unlock guided sessions.
                  </p>
                  <Button variant="zen" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;
