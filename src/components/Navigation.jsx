import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, CheckSquare, User, Settings, BarChart3 } from "lucide-react";

const Navigation = ({ activeSection, onSectionChange, isGuestMode, user, onSignIn, onSignUp, onSignOut }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: CheckSquare, variant: "calm" },
    { id: "pomodoro", label: "Focus Timer", icon: Clock, variant: "focus" },
    { id: "todos", label: "Tasks", icon: CheckSquare, variant: "zen" },
    { id: "journal", label: "Journal", icon: BookOpen, variant: "calm" },
    { id: "meditation", label: "Meditation", icon: Brain, variant: "meditation" },
    { id: "analytics", label: "Analytics", icon: BarChart3, variant: "zen" },
  ];

  return (
    <div className="glass-navbar-container">
      <motion.nav 
        className="glass-navbar px-4 py-3"
        style={{ 
          width: 'fit-content',
          minWidth: '800px',
          maxWidth: '90vw'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      <div className="flex items-center justify-between w-full">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-zen rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-zen bg-clip-text text-transparent">
              FocusFlow
            </h1>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={activeSection === item.id ? item.variant : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isGuestMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={onSignIn}>
                  Sign In
                </Button>
                <Button variant="zen" size="sm" onClick={onSignUp}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name || user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={onSignOut}>
                  Sign Out
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon">
              {isGuestMode ? <User className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </Button>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navigation;
