import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TodoList = ({ isGuestMode }) => {
  const { token } = useAuth();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDeadline, setNewDeadline] = useState("");

  
  useEffect(() => {
    const loadTodos = async () => {
      if (isGuestMode) {
        const savedTodos = localStorage.getItem("focusflow-todos");
        if (savedTodos) {
          setTodos(
            JSON.parse(savedTodos).map((todo) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
            }))
          );
        }
      } else if (token) {
        await fetchTodos();
      }
    };
    loadTodos();
  }, [isGuestMode, token]);

  
  useEffect(() => {
    if (isGuestMode) {
      localStorage.setItem("focusflow-todos", JSON.stringify(todos));
    }
  }, [todos, isGuestMode]);

  
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:3000/task", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      
      setTodos(data.tasks.map((task) => ({ ...task, id: task._id })));
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    if (isGuestMode) {
      const todo = {
        id: Date.now().toString(),
        task: newTodo.trim(),
        completed: false,
        priority: newPriority,
        dueDate: newDeadline || undefined,
        status: "pending",
        createdAt: new Date(),
      };
      setTodos((prev) => [todo, ...prev]);
    } else {
      try {
        const res = await fetch("http://localhost:3000/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: newTodo.trim(),
            priority: newPriority,
            dueDate: newDeadline,
          }),
        });
        if (!res.ok) throw new Error("Failed to add task");
        await fetchTodos();
      } catch (err) {
        console.error("Error adding task:", err);
      }
    }

    setNewTodo("");
    setNewDeadline("");
    setNewPriority("medium");
  };

  const toggleTodo = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    if (isGuestMode) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus, completed: !todo.completed } : todo
        )
      );
    } else {
      try {
        const res = await fetch(`http://localhost:3000/task/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update task");
        await fetchTodos();
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
  };

  const deleteTodo = async (id) => {
  if (isGuestMode) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  } else {
    try {
      const res = await fetch(`http://localhost:3000/task/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      
      await fetchTodos();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }
};


  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-focus text-focus-foreground";
      case "low":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };
  const sortedTodos = [...todos].sort((a, b) => {
    if ((a.status === "completed") !== (b.status === "completed")) return a.status === "completed" ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = todos.filter((todo) => todo.status === "completed").length;
  const totalCount = todos.length;

  
  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #10b981 100%)`, backgroundSize: "100% 100%" }}
      />
      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Task Management</h2>
            <p className="text-muted-foreground">Organize your tasks with priorities and deadlines</p>
            {isGuestMode && <p className="text-sm text-amber-600 mt-2">📝 Guest mode: Tasks are stored locally and will be lost when you clear browser data</p>}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Add Task Form */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 sticky top-28">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Add New Task</h3>
                <div className="space-y-4">
                  <Input placeholder="What needs to be done?" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addTodo()} className="bg-background/50" />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        {["low", "medium"].map((priority) => (
                          <Button key={priority} variant={newPriority === priority ? "default" : "outline"} size="sm" onClick={() => setNewPriority(priority)} className="flex-1">
                            {getPriorityIcon(priority)} {priority}
                          </Button>
                        ))}
                      </div>
                      <Button variant={newPriority === "high" ? "default" : "outline"} size="sm" onClick={() => setNewPriority("high")} className="w-full">
                        {getPriorityIcon("high")} high
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Deadline (optional)</label>
                    <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="bg-background/50" />
                  </div>
                  <Button onClick={addTodo} className="w-full" variant="zen">
                    <Plus className="w-4 h-4 mr-2" /> Add Task
                  </Button>
                </div>

                {/* Progress Stats */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>{completedCount}/{totalCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-zen h-2 rounded-full transition-all duration-500" style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }} />
                    </div>
                    {totalCount > 0 && <div className="text-xs text-muted-foreground text-center">{Math.round((completedCount / totalCount) * 100)}% Complete</div>}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Todo List */}
            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Your Tasks ({todos.length})</h3>
                {todos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks yet</h3>
                    <p className="text-sm text-muted-foreground">Add your first task to get started with your productivity journey</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sortedTodos.map((todo) => (
                        <motion.div key={todo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} layout className={`p-4 rounded-lg border transition-all duration-200 ${todo.status === "completed" ? "bg-muted/50 border-muted" : "bg-background/50 border-border hover:border-primary/50"}`}>
                          <div className="flex items-start space-x-3">
                            <Checkbox checked={todo.status === "completed"} onCheckedChange={() => toggleTodo(todo.id, todo.status)} className="mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary" className={`${getPriorityColor(todo.priority)} text-xs`}>
                                  {getPriorityIcon(todo.priority)} {todo.priority}
                                </Badge>
                                {todo.dueDate && (
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(todo.dueDate).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${todo.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {todo.task}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
