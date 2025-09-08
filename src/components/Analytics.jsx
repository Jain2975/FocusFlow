import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Brain, 
  Coffee, 
  Lock,
  ChevronDown,
  Filter,
  BarChart3
} from "lucide-react";

const Analytics = ({ isGuestMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data - in real app this would come from backend
  const focusSessionData = [
    { day: "Mon", sessions: 4, minutes: 95, breaks: 3 },
    { day: "Tue", sessions: 6, minutes: 145, breaks: 5 },
    { day: "Wed", sessions: 3, minutes: 75, breaks: 2 },
    { day: "Thu", sessions: 5, minutes: 125, breaks: 4 },
    { day: "Fri", sessions: 7, minutes: 165, breaks: 6 },
    { day: "Sat", sessions: 2, minutes: 50, breaks: 1 },
    { day: "Sun", sessions: 3, minutes: 75, breaks: 2 }
  ];

  const weeklyTrendData = [
    { week: "Week 1", focus: 420, meditation: 45, tasks: 28 },
    { week: "Week 2", focus: 385, meditation: 60, tasks: 32 },
    { week: "Week 3", focus: 495, meditation: 75, tasks: 41 },
    { week: "Week 4", focus: 520, meditation: 90, tasks: 38 }
  ];

  const productivityDistribution = [
    { name: "Deep Focus", value: 45, color: "hsl(var(--primary))" },
    { name: "Regular Work", value: 30, color: "hsl(var(--focus))" },
    { name: "Breaks", value: 15, color: "hsl(var(--accent))" },
    { name: "Meditation", value: 10, color: "hsl(var(--meditation))" }
  ];

  const dailyMoodData = [
    { day: "Mon", mood: 7, energy: 6 },
    { day: "Tue", mood: 8, energy: 8 },
    { day: "Wed", mood: 6, energy: 5 },
    { day: "Thu", mood: 9, energy: 7 },
    { day: "Fri", mood: 8, energy: 9 },
    { day: "Sat", mood: 9, energy: 8 },
    { day: "Sun", mood: 7, energy: 6 }
  ];

  const stats = [
    {
      label: "Total Focus Time",
      value: "42.5h",
      change: "+15%",
      icon: Clock,
      color: "text-focus",
      trend: "up"
    },
    {
      label: "Completed Sessions",
      value: "87",
      change: "+23%",
      icon: Target,
      color: "text-primary",
      trend: "up"
    },
    {
      label: "Meditation Minutes",
      value: "180",
      change: "+8%",
      icon: Brain,
      color: "text-meditation",
      trend: "up"
    },
    {
      label: "Tasks Completed",
      value: "124",
      change: "+12%",
      icon: Award,
      color: "text-accent",
      trend: "up"
    }
  ];

  const achievements = [
    { title: "Focus Master", description: "Completed 50 focus sessions", emoji: "🎯", date: "2 days ago" },
    { title: "Mindful Week", description: "Meditated 7 days in a row", emoji: "🧘‍♀️", date: "1 week ago" },
    { title: "Task Crusher", description: "Completed 100 tasks", emoji: "✅", date: "2 weeks ago" },
    { title: "Early Bird", description: "Started 5 morning sessions", emoji: "🌅", date: "3 weeks ago" }
  ];

  if (isGuestMode) {
    return (
      <div className="min-h-screen bg-gradient-calm pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 bg-card/80 backdrop-blur-sm border-border/50 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Analytics Requires Sign In
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Unlock detailed insights about your productivity patterns, focus trends, 
                and personal growth metrics. See how you're improving over time!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <BarChart3 className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Detailed Charts</h3>
                  <p className="text-muted-foreground">Visual insights into your habits</p>
                </div>
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Progress Tracking</h3>
                  <p className="text-muted-foreground">See your improvement over time</p>
                </div>
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <Award className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Achievements</h3>
                  <p className="text-muted-foreground">Unlock badges and milestones</p>
                </div>
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Habit Tracking</h3>
                  <p className="text-muted-foreground">Monitor daily consistency</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="zen" size="lg" className="w-full">
                  Sign In to View Analytics
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Create Free Account
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Track your productivity patterns and personal growth
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <span>{selectedPeriod === "week" ? "This Week" : selectedPeriod}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Focus Sessions Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Daily Focus Sessions</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={focusSessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Productivity Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Time Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productivityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {productivityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {productivityDistribution.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Weekly Trends */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area type="monotone" dataKey="focus" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="meditation" stroke="hsl(var(--meditation))" fill="hsl(var(--meditation))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Mood & Energy Tracking */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Mood & Energy</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyMoodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--focus))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--focus))", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="hsl(var(--meditation))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--meditation))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-focus" />
                    <span className="text-sm text-muted-foreground">Mood</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-meditation" />
                    <span className="text-sm text-muted-foreground">Energy</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.title}
                    className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-200"
                  >
                    <div className="text-2xl mb-2">{achievement.emoji}</div>
                    <h4 className="font-semibold text-foreground mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
