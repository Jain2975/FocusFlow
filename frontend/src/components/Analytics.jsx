import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  Calendar, Clock, Target, TrendingUp, Award, Brain, Lock,
  ChevronDown, Filter, BarChart3
} from "lucide-react";
import { useAuth,BASE_URL} from "@/contexts/AuthContext";

const Analytics = ({ isGuestMode }) => {
  const {token}=useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Backend data states
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [productivityDistribution, setProductivityDistribution] = useState([]);
  const [dailyMood, setDailyMood] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuestMode) return;

    const token = localStorage.getItem("token"); // JWT from login
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchWeeklyTrends = fetch(`${BASE_URL}/analytics/weekly-trends`, { headers })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch weekly trends");
        return res.json();
      })
      .then(data => setWeeklyTrends(data))
      .catch(err => console.error(err));

    const fetchProductivityDistribution = fetch(`${BASE_URL}/analytics/productivity-distribution`, { headers })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch productivity distribution");
        return res.json();
      })
      .then(data => setProductivityDistribution(data))
      .catch(err => console.error(err));

    const fetchDailyMood = fetch(`${BASE_URL}/analytics/daily-mood`, { headers })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch daily mood");
        return res.json();
      })
      .then(data => setDailyMood(data))
      .catch(err => console.error(err));

    Promise.all([fetchWeeklyTrends, fetchProductivityDistribution, fetchDailyMood])
      .finally(() => setLoading(false));

    const fetchStats = fetch(`${BASE_URL}/analytics/stats`, { headers })
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  })
  .then(data => setStats(data))
  .catch(err => console.error(err));

Promise.all([fetchWeeklyTrends, fetchProductivityDistribution, fetchDailyMood, fetchStats])
  .finally(() => setLoading(false));

  const fetchAchievements = fetch(`${BASE_URL}/analytics/achievements`, { headers })
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch achievements");
    return res.json();
  })
  .then(data => setAchievements(data))
  .catch(err => console.error(err));

Promise.all([fetchWeeklyTrends, fetchProductivityDistribution, fetchDailyMood, fetchStats, fetchAchievements])
  .finally(() => setLoading(false));



  }, [isGuestMode]);

 
  const statCards = stats ? [
  { label: "Total Focus Time", value: `${stats.totalFocusTime}h`, change: "+15%", icon: Clock, color: "text-focus" },
  { label: "Completed Sessions", value: stats.completedSessions, change: "+23%", icon: Target, color: "text-primary" },
  { label: "Meditation Minutes", value: `${stats.meditationMinutes}`, change: "+8%", icon: Brain, color: "text-meditation" },
  { label: "Tasks Completed", value: stats.tasksCompleted, change: "+12%", icon: Award, color: "text-accent" }
] : [];



  if (isGuestMode) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-12 bg-card/80 backdrop-blur-sm border-border/50 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Analytics Requires Sign In</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Unlock detailed insights about your productivity patterns, focus trends, and personal growth metrics.
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
                <Button variant="zen" size="lg" className="w-full">Sign In to View Analytics</Button>
                <Button variant="outline" size="lg" className="w-full">Create Free Account</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center mt-24">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Track your productivity patterns and personal growth</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" /><span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <span>{selectedPeriod === "week" ? "This Week" : selectedPeriod}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`${stat.color} w-8 h-8`} />
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />{stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="focus" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="meditation" stroke="hsl(var(--meditation))" fill="hsl(var(--meditation))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Time Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={productivityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {productivityDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Mood </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyMood}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--focus))" strokeWidth={3} dot={{ fill: "hsl(var(--focus))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((ach, i) => (
                <div key={i} className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-200">
                  <div className="text-2xl mb-2">{ach.emoji}</div>
                  <h4 className="font-semibold text-foreground mb-1">{ach.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{ach.description}</p>
                  <p className="text-xs text-muted-foreground">{ach.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
