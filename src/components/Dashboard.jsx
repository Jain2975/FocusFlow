import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, BookOpen, Brain, CheckSquare, Timer, Target } from "lucide-react";

const Dashboard = ({ onSectionChange, isGuestMode }) => {
  const quickActions = [
    {
      id: "pomodoro",
      title: "Start Focus Session",
      description: "Begin a 25-minute focused work session",
      icon: Clock,
      variant: "focus",
      gradient: "from-focus to-orange-400"
    },
    {
      id: "meditation",
      title: "Mindful Moment",
      description: "Take a break with guided meditation",
      icon: Brain,
      variant: "meditation",
      gradient: "from-meditation to-purple-400"
    },
    {
      id: "todos",
      title: "Review Tasks",
      description: "Check your priority tasks for today",
      icon: CheckSquare,
      variant: "zen",
      gradient: "from-primary to-emerald-400"
    },
    {
      id: "journal",
      title: "Reflect & Write",
      description: isGuestMode ? "Sign in to unlock journaling" : "Express your thoughts",
      icon: BookOpen,
      variant: "calm",
      gradient: "from-accent to-amber-300"
    }
  ];

  const stats = [
    { label: "Focus Sessions Today", value: "3", icon: Timer },
    { label: "Tasks Completed", value: "7", icon: Target },
    { label: "Meditation Minutes", value: "15", icon: Brain },
  ];

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Emerald Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-zen bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-zen bg-clip-text text-transparent">
              Welcome to Your Mindful Space
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isGuestMode 
                ? "You're in guest mode. Sign in to unlock all features and save your progress."
                : "Your personal sanctuary for focus, reflection, and growth."}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-stats p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="glass-card p-6 h-full cursor-pointer">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button 
                      variant={action.variant} 
                      size="sm" 
                      className="w-full"
                      onClick={() => onSectionChange(action.id)}
                      disabled={isGuestMode && action.id === "journal"}
                    >
                      {action.id === "journal" && isGuestMode ? "Sign In Required" : "Get Started"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Guest Mode Banner */}
          {isGuestMode && (
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Unlock Your Full Potential
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to save your progress, sync across devices, and access premium features.
                </p>
                <Button variant="zen">
                  Create Free Account
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
