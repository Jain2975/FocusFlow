import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import PomodoroTimer from "@/components/PomodoroTimer";
import TodoList from "@/components/TodoList";
import Journal from "@/components/Journal";
import Meditation from "@/components/Meditation";
import Analytics from "@/components/Analytics";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [authView, setAuthView] = useState(null); // 'signin', 'signup', or null
  const { user, signIn, signUp, signOut, isAuthenticated } = useAuth();

  const handleSignIn = (userData) => {
    signIn(userData);
    setAuthView(null);
  };

  const handleSignUp = (userData) => {
    signUp(userData);
    setAuthView(null);
  };

  const handleSignOut = () => {
    signOut();
    setActiveSection("dashboard");
  };

  // Show auth views if requested
  if (authView === 'signin') {
    return (
      <SignIn
        onBack={() => setAuthView(null)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setAuthView('signup')}
      />
    );
  }

  if (authView === 'signup') {
    return (
      <SignUp
        onBack={() => setAuthView(null)}
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setAuthView('signin')}
      />
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onSectionChange={setActiveSection} isGuestMode={!isAuthenticated} />;
      case "pomodoro":
        return <PomodoroTimer isGuestMode={!isAuthenticated} />;
      case "todos":
        return <TodoList isGuestMode={!isAuthenticated} />;
      case "journal":
        return <Journal 
          isGuestMode={!isAuthenticated} 
          onSignIn={() => setAuthView('signin')}
          onSignUp={() => setAuthView('signup')}
        />;
      case "analytics":
        return <Analytics isGuestMode={!isAuthenticated} />;
      case "meditation":
        return <Meditation isGuestMode={!isAuthenticated} />;
      default:
        return <Dashboard onSectionChange={setActiveSection} isGuestMode={!isAuthenticated} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isGuestMode={!isAuthenticated}
        user={user}
        onSignIn={() => setAuthView('signin')}
        onSignUp={() => setAuthView('signup')}
        onSignOut={handleSignOut}
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
