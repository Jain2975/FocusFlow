import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BookOpen, Save, Calendar, Sparkles, Lock } from "lucide-react";

const Journal = ({ isGuestMode }) => {
  const [entry, setEntry] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");

  const prompts = [
    "What am I grateful for today?",
    "What challenged me today and how did I grow from it?",
    "What is one thing I accomplished that I'm proud of?",
    "How am I feeling right now, and why?",
    "What is one lesson I learned today?",
    "What would I like to improve about tomorrow?",
    "What brought me joy today?",
    "What am I looking forward to?"
  ];

  const moods = [
    { emoji: "😊", label: "Happy", color: "text-amber-500" },
    { emoji: "😌", label: "Peaceful", color: "text-emerald-500" },
    { emoji: "🤔", label: "Thoughtful", color: "text-blue-500" },
    { emoji: "😴", label: "Tired", color: "text-slate-500" },
    { emoji: "😤", label: "Frustrated", color: "text-red-500" },
    { emoji: "🥳", label: "Excited", color: "text-purple-500" },
    { emoji: "😢", label: "Sad", color: "text-blue-400" },
    { emoji: "💪", label: "Motivated", color: "text-orange-500" }
  ];

  const handleSave = () => {
    if (!title.trim() && !entry.trim()) return;
    
    // In a real app, this would save to backend
    console.log("Saving journal entry:", { title, entry, mood, date: new Date() });
    
    // Reset form
    setTitle("");
    setEntry("");
    setMood("");
    
    // Show success message
    alert("Journal entry saved! (This is demo mode)");
  };

  const insertPrompt = (prompt) => {
    setEntry(prev => prev + (prev ? "\n\n" : "") + prompt + "\n");
  };

  if (isGuestMode) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-6">
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
                Journaling Requires Sign In
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your thoughts and reflections are precious. Sign in to create a secure space 
                for your personal journal entries that sync across all your devices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Private & Secure</h3>
                  <p className="text-muted-foreground">Your entries are encrypted and private</p>
                </div>
                <div className="p-4 bg-gradient-zen/10 rounded-lg border border-primary/20">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Track Progress</h3>
                  <p className="text-muted-foreground">See your growth over time</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="zen" size="lg" className="w-full">
                  Sign In to Start Journaling
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
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-foreground">Daily Journal</h2>
          <p className="text-muted-foreground">
            Reflect on your thoughts, experiences, and growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing Area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Today's Entry</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Entry Title (Optional)
                  </label>
                  <Input
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="text-sm text-muted-foreground mb-3 block">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {moods.map((m) => (
                      <Button
                        key={m.label}
                        variant={mood === m.label ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMood(m.label)}
                        className="h-12 flex flex-col space-y-1 p-2"
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span className="text-xs">{m.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Writing Area */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your thoughts...
                  </label>
                  <Textarea
                    placeholder="Start writing your thoughts, reflections, or experiences..."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    className="min-h-80 bg-background/50 resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2 text-right">
                    {entry.length} characters
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Auto-saved locally
                  </div>
                  <Button onClick={handleSave} variant="zen">
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Writing Prompts */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Writing Prompts
              </h3>
              <div className="space-y-2">
                {prompts.slice(0, 6).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => insertPrompt(prompt)}
                    className="w-full text-left p-3 text-sm bg-background/50 hover:bg-background/80 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Journal Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entries this month</span>
                  <span className="font-semibold text-foreground">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current streak</span>
                  <span className="font-semibold text-foreground">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words written</span>
                  <span className="font-semibold text-foreground">2,450</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-zen/10 border-primary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                💡 Journaling Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Write without judging yourself</li>
                <li>• Focus on your feelings and thoughts</li>
                <li>• Don't worry about perfect grammar</li>
                <li>• Try to journal at the same time daily</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
