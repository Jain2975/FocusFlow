import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings, Coffee, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Make sure this points to your AuthContext

const PomodoroTimer = ({ isGuestMode }) => {
  const { token, user, isAuthenticated } = useAuth();

  const [durations, setDurations] = useState({
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  });

  const [timeLeft, setTimeLeft] = useState(durations.work);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState("work");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const circleRef = useRef(null);
  const intervalRef = useRef(null);

  const sessionConfig = {
    work: { time: durations.work, label: "Focus Time", color: "stroke-focus" },
    break: { time: durations.break, label: "Short Break", color: "stroke-primary" },
    longBreak: { time: durations.longBreak, label: "Long Break", color: "stroke-meditation" },
  };

  const currentConfig = sessionConfig[currentSession];
  const progress = ((currentConfig.time - timeLeft) / currentConfig.time) * 100;

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  // Progress animation
  useEffect(() => {
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        strokeDasharray: `${progress * 2.51} 251.2`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [progress]);

  // Reset timeLeft if session/durations change while not running
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(sessionConfig[currentSession].time);
    }
  }, [durations, currentSession]);

  // Handle session complete and save cycle if logged in
  const handleSessionComplete = async () => {
    setIsActive(false);

    if (currentSession === "work") {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);

      // Save cycle to backend if user is authenticated
      if (!isGuestMode && token && sessionStartTime) {
  const endTime = new Date();
  const durationMinutes = (endTime - sessionStartTime) / 60000;

  try {
    await fetch("http://localhost:3000/pomodoro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startTime: sessionStartTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMinutes,
        status: "completed",
        type: currentSession // save session type too
      }),
    });
  } catch (err) {
    console.error("Failed to save cycle:", err);
  }
}


      // Decide next session
      if (newCount % 4 === 0) {
        setCurrentSession("longBreak");
        setTimeLeft(sessionConfig.longBreak.time);
      } else {
        setCurrentSession("break");
        setTimeLeft(sessionConfig.break.time);
      }
    } else {
      setCurrentSession("work");
      setTimeLeft(sessionConfig.work.time);
    }

    // Celebration animation
    if (circleRef.current) {
      gsap.from(circleRef.current, {
        scale: 1.2,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    }

    setSessionStartTime(null);
  };

  const toggleTimer = () => {
    if (!isActive) setSessionStartTime(new Date());
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(currentConfig.time);
    setSessionStartTime(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchSession = (session) => {
    setIsActive(false);
    setCurrentSession(session);
    setTimeLeft(sessionConfig[session].time);
    setSessionStartTime(null);
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)`,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Focus Timer</h2>
            <p className="text-muted-foreground">Stay focused with the Pomodoro Technique</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timer */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border/50">
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted opacity-20" strokeDasharray="251.2" />
                    <circle
                      ref={circleRef}
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className={`${currentConfig.color} transition-colors duration-500`}
                      strokeDasharray="0 251.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-foreground mb-2">{formatTime(timeLeft)}</div>
                    <div className="text-lg text-muted-foreground">{currentConfig.label}</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <Button variant={isActive ? "outline" : "focus"} size="lg" onClick={toggleTimer} className="min-w-32">
                    {isActive ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" /> Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetTimer}>
                    <RotateCcw className="w-5 h-5 mr-2" /> Reset
                  </Button>
                </div>

                {/* Quick Session Switch */}
                <div className="flex justify-center space-x-2">
                  <Button variant={currentSession === "work" ? "focus" : "ghost"} size="sm" onClick={() => switchSession("work")}>
                    <Brain className="w-4 h-4 mr-1" /> Work
                  </Button>
                  <Button variant={currentSession === "break" ? "zen" : "ghost"} size="sm" onClick={() => switchSession("break")}>
                    <Coffee className="w-4 h-4 mr-1" /> Break
                  </Button>
                  <Button variant={currentSession === "longBreak" ? "meditation" : "ghost"} size="sm" onClick={() => switchSession("longBreak")}>
                    <Coffee className="w-4 h-4 mr-1" /> Long Break
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Stats & Settings */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              {/* Stats */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Today's Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sessions Completed</span>
                    <span className="text-xl font-bold text-foreground">{sessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Focus Time</span>
                    <span className="text-xl font-bold text-foreground">
                      {Math.floor((sessionsCompleted * (durations.work / 60)) / 60)}h {(sessionsCompleted * (durations.work / 60)) % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Streak</span>
                    <span className="text-xl font-bold text-foreground">{isGuestMode ? "Sign in to track" : "3 days"}</span>
                  </div>
                </div>
              </Card>

              {/* Settings */}
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Settings</h3>
                <div className="space-y-3">
                  {["work", "break", "longBreak"].map((sess) => (
                    <div key={sess} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{sess.charAt(0).toUpperCase() + sess.slice(1)} Duration</span>
                      <input
                        type="number"
                        min="1"
                        className="w-16 p-1 border rounded text-center"
                        value={durations[sess] / 60}
                        onChange={(e) => setDurations({ ...durations, [sess]: e.target.value * 60 })}
                      />
                      <span className="ml-2 text-foreground">min</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="w-4 h-4 mr-2" /> {showSettings ? "Close" : "Customize"}
                  </Button>
                </div>
              </Card>

              {/* Guest Mode */}
              {isGuestMode && (
                <Card className="p-6 bg-gradient-zen/10 border-primary/20 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Unlock More Features</h3>
                  <p className="text-sm text-muted-foreground mb-4">Sign in to save your progress and access custom timer settings.</p>
                  <Button variant="zen" size="sm" className="w-full">Sign In</Button>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
