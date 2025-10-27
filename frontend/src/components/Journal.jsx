import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BookOpen, Save, Calendar, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Journal = ({ isGuestMode, onSignIn, onSignUp }) => {
  const { token } = useAuth();

  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [editingId, setEditingId] = useState(null);

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "🥳", label: "Excited" },
    { emoji: "😢", label: "Sad" },
    { emoji: "💪", label: "Motivated" }
  ];

  // Load existing entries
  useEffect(() => {
    if (isGuestMode) {
      const savedEntries = localStorage.getItem("focusflow-journal");
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } else {
      fetchEntries();
    }
  }, [isGuestMode]);

  // Sync guest entries to localStorage
  useEffect(() => {
    if (isGuestMode) {
      localStorage.setItem("focusflow-journal", JSON.stringify(entries));
    }
  }, [entries, isGuestMode]);

  // -----------------
  // Backend functions
  // -----------------
  const fetchEntries = async () => {
    try {
      const res = await fetch("http://localhost:3000/journal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch journal entries");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
    }
  };

  const startEdit = (entry) => {
  setEditingId(entry._id || entry.id);
  setTitle(entry.title);
  setEntry(entry.content);
  setMood(entry.mood);
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this journal entry?")) return;

  try {
    if (isGuestMode) {
      setEntries(prev => prev.filter(e => e.id !== id));
    } else {
      const res = await fetch(`http://localhost:3000/journal/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchEntries();
    }
  } catch (err) {
    console.error("Error deleting entry:", err);
  }
};

  // const handleSave = async () => {
  //   if (!title.trim() && !entry.trim()) return;

  //   if (isGuestMode) {
  //     const newEntry = {
  //       id: Date.now().toString(),
  //       title,
  //       content: entry,
  //       mood,
  //       date: new Date(),
  //     };
  //     setEntries(prev => [newEntry, ...prev]);
  //     setTitle("");
  //     setEntry("");
  //     setMood("");
  //     alert("Journal entry saved locally!");
  //   } else {
  //     try {
  //       const res = await fetch("http://localhost:3000/journal", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ title, content: entry, mood }),
  //       });
  //       const data = await res.json();
  //       if (!res.ok) throw new Error(data.error || "Failed to save entry");

  //       // Refresh list from backend
  //       fetchEntries();

  //       setTitle("");
  //       setEntry("");
  //       setMood("");
  //       alert("Journal entry saved!");
  //     } catch (err) {
  //       console.error("Error saving journal entry:", err);
  //       alert("Failed to save entry. See console.");
  //     }
  //   }
  // };
  const handleSave = async () => {
  if (!title.trim() && !entry.trim()) return;

  try {
    if (isGuestMode) {
      if (editingId) {
        setEntries(prev => prev.map(e => e.id === editingId ? { ...e, title, content: entry, mood } : e));
        setEditingId(null);
      } else {
        const newEntry = {
          id: Date.now().toString(),
          title,
          content: entry,
          mood,
          date: new Date(),
        };
        setEntries(prev => [newEntry, ...prev]);
      }
    } else {
      const url = editingId
        ? `http://localhost:3000/journal/${editingId}`
        : `http://localhost:3000/journal`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content: entry, mood }),
      });

      if (!res.ok) throw new Error("Failed to save");
      fetchEntries();
      setEditingId(null);
    }

    setTitle("");
    setEntry("");
    setMood("");
    alert(editingId ? "Entry updated!" : "Entry saved!");
  } catch (err) {
    console.error("Error saving entry:", err);
  }
};

  const insertPrompt = (prompt) => {
    setEntry(prev => prev + (prev ? "\n\n" : "") + prompt + "\n");
  };

  // -----------------
  // Guest mode lock screen
  // -----------------
  if (isGuestMode) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-12 bg-card/80 backdrop-blur-sm border-border/50 max-w-2xl mx-auto">
              <div className="text-6xl mb-6"><Lock className="w-16 h-16 mx-auto text-muted-foreground" /></div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Journaling Requires Sign In</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your thoughts and reflections are precious. Sign in to sync across devices.
              </p>
              <div className="space-y-3">
                <Button variant="zen" size="lg" className="w-full" onClick={onSignIn}>Sign In</Button>
                <Button variant="outline" size="lg" className="w-full" onClick={onSignUp}>Create Account</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // -----------------
  // Authenticated journal UI
  // -----------------
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold mb-2 text-foreground">Daily Journal</h2>
          <p className="text-muted-foreground">Reflect on your thoughts, experiences, and growth</p>
        </motion.div>

        {/* Entry form */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mb-8">
          <Input
            placeholder="Entry title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 bg-background/50"
          />
          <div className="grid grid-cols-4 gap-2 mb-4">
            {moods.map(m => (
              <Button
                key={m.label}
                variant={mood === m.label ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMood(m.label.toLowerCase())}
              >
                {m.emoji} {m.label}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="mb-4 bg-background/50 resize-none min-h-48"
          />
          <Button onClick={handleSave} variant="zen">
            <Save className="w-4 h-4 mr-2" /> Save Entry
          </Button>
        </Card>

        {/* Display entries */}
        <div className="space-y-4">
          {entries.length === 0 && <p className="text-muted-foreground text-center">No journal entries yet</p>}
          {entries.map(e => (
            <Card key={e.id || e._id} className="p-4 bg-card/80 border-border/50">
              {e.title && <h3 className="font-semibold mb-1 text-foreground">{e.title}</h3>}
              {e.mood && <span className="text-sm text-muted-foreground mb-2 block">{e.mood}</span>}
              <p className="text-foreground whitespace-pre-wrap">{e.content}</p>
              <div className="text-xs text-muted-foreground mt-2">{new Date(e.date || e.createdAt).toLocaleString()}</div>
              <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEdit(e)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(e._id || e.id)}
              >
                Delete
              </Button>
            </div>
            
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
