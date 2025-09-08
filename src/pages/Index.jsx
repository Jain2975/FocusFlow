import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import PomodoroTimer from "@/components/PomodoroTimer";
import TodoList from "@/components/TodoList";
import Journal from "@/components/Journal";
import Meditation from "@/components/Meditation";
import Analytics from "@/components/Analytics";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isGuestMode, setIsGuestMode] = useState(true);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onSectionChange={setActiveSection} isGuestMode={isGuestMode} />;
      case "pomodoro":
        return <PomodoroTimer isGuestMode={isGuestMode} />;
      case "todos":
        return <TodoList isGuestMode={isGuestMode} />;
      case "journal":
        return <Journal isGuestMode={isGuestMode} />;
      case "analytics":
        return <Analytics isGuestMode={isGuestMode} />;
      case "meditation":
        return <Meditation isGuestMode={isGuestMode} />;
      default:
        return <Dashboard onSectionChange={setActiveSection} isGuestMode={isGuestMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isGuestMode={isGuestMode}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
