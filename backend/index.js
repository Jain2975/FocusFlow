import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import { type } from "os";
import { error } from "console";
import bcrypt from "bcrypt";
import { parseCSSVariable } from "framer-motion";
import jwt from "jsonwebtoken";
dotenv.config();

const port=3000;
const app=express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("Connection successful"))
    .catch(err=> console.log("Error connecting to database",err));


//Schemas for MongoDB
const UserSchema=new mongoose.Schema({
    name:String,
    email: {type: String , unique: true},
    password: String
});

const PomodoroTimer = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: Date,
  endTime: Date,
  duration: Number,
  status: { type: String, enum: ["completed", "skipped"], default: "completed" }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: String,  
  dueDate: Date,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
}, { timestamps: true });

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  mood: { type: String, enum: ["happy", "sad", "neutral", "stressed"], default: "neutral" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const meditationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: Date,
  endTime: Date,
  duration: Number
});

const User=mongoose.model("User",UserSchema);

const Pomodoro=mongoose.model("Pomodoro",PomodoroTimer);
const Task=mongoose.model("Task",taskSchema);
const Journal=mongoose.model("Journal",journalSchema);
const Meditation=mongoose.model("Meditation",meditationSchema);


app.post("/signup",async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({error: "Missing fields"});

        }
        
        const exists=await User.findOne({email});
        if(exists) return res.status(409).json({error: "User with email already exists"});

        const saltRounds=10;
        const hashedpassword=await bcrypt.hash(password,saltRounds);

        const newuser=await User.create({name,email,password: hashedpassword});

        res.status(200).json({message: "User registered successfully"});


    }catch(err){
        console.log("Error in signup",err);
        res.status(500).json({ error: "Server error" });
    }

});

app.post("/signin", async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || ! password){
            return res.status(409).json({error: "Missing fields"});
        }
        const user=await User.findOne({email});
        if (!user) return res.status(404).json({ error: "User not found" });

        const correct=  bcrypt.compare(password,user.password);

        if(correct){
            const token=jwt.sign({
                userID: user._id,email: user.email,name: user.name
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
            res.status(200).json({message: "Sign In successful",token,
              id: user._id,
              name: user.name,
              email: user.email
            });
        }else{
            res.status(401).json({error: "Password did not match"});
        }
    }catch(err){
        console.log("Error in signup",err);
        res.status(500).json({ error: "Server error" });
    }    
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded; // user info from token
    next();
  });
};

app.post("/pomodoro", authenticateJWT, async (req, res) => {
  const { startTime, endTime, duration, status } = req.body;
  if (!startTime || !endTime || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCycle = new Pomodoro({
      userId: req.user.userID,
      startTime,
      endTime,
      duration,
      status: status || "completed",
    });

    await newCycle.save();
    res.status(201).json({ message: "Pomodoro cycle saved successfully" });
  } catch (err) {
    console.error("Error saving Pomodoro cycle:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/meditation", authenticateJWT, async (req, res) => {
  const { startTime, endTime, duration } = req.body;

  if (!startTime || !endTime || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newSession = new Meditation({
      userId: req.user.userID, // from JWT middleware
      startTime,
      endTime,
      duration,
    });

    await newSession.save();
    res.status(201).json({ message: "Meditation session saved successfully" });
  } catch (err) {
    console.error("Error saving meditation session:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all tasks for the logged-in user
app.get("/task", authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userID });
    res.status(200).json({tasks});
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/task",authenticateJWT,async (req,res)=>{
  
  const {task,priority,dueDate}=req.body;

  if(!task || !dueDate || !priority) return res.status(400).json({error: "Missing fields"});
  try{
  const tk=new Task({
    userId: req.user.userID,
    task,priority,
    dueDate,
    status: "pending"
  });

  await tk.save();
  res.status(201).json({ message: "Task Added successfully",task:tk});
}catch(err){
   console.error("Error saving task:", err);
   res.status(500).json({ message: "Server error" });
}
});

app.patch("/task/:id", authenticateJWT, async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/task/:id", authenticateJWT, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/journal", authenticateJWT, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.userID }).sort({ createdAt: -1 });
    res.status(200).json({ entries });
  } catch (err) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/journal", authenticateJWT, async (req, res) => {
  const { title, content, mood } = req.body;

  if (!content) return res.status(400).json({ error: "Content is required" });

  try {
    const entry = new Journal({
      userId: req.user.userID,
      title,
      content,
      mood,
    });
    await entry.save();
    res.status(201).json({ message: "Journal entry saved", entry });
  } catch (err) {
    console.error("Error saving journal entry:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// // Get focus session analytics
// app.get("/analytics/focus-sessions", authenticateJWT, async (req, res) => {
//   try {
//     const sessions = await Pomodoro.find({ userId: req.user.userID });
//     res.status(200).json({ sessions });
//   } catch (err) {
//     console.error("Error fetching focus sessions:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get meditation analytics
// app.get("/analytics/meditation", authenticateJWT, async (req, res) => {
//   try {
//     const meditation = await Meditation.find({ userId: req.user.userID });
//     res.status(200).json({ meditation });
//   } catch (err) {
//     console.error("Error fetching meditation data:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get task analytics
// app.get("/analytics/tasks", authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.user.userID });
//     res.status(200).json({ tasks });
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Weekly Trends (example using Pomodoro + Meditation)
app.get("/analytics/weekly-trends", authenticateJWT, async (req, res) => {
  try {
    const pomodoros = await Pomodoro.find({ userId: req.user.userID });
    const meditation = await Meditation.find({ userId: req.user.userID });

    // create dummy weekly data
    const data = [
      { week: "Week 1", focus: pomodoros.length, meditation: meditation.length },
      { week: "Week 2", focus: pomodoros.length, meditation: meditation.length },
    ];

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Productivity Distribution
app.get("/analytics/productivity-distribution", authenticateJWT, async (req, res) => {
  try {
    const focus = await Pomodoro.countDocuments({ userId: req.user.userID });
    const meditation = await Meditation.countDocuments({ userId: req.user.userID });
    const tasks = await Task.countDocuments({ userId: req.user.userID });

    const data = [
      { name: "Focus", value: focus, color: "#3b82f6" },
      { name: "Meditation", value: meditation, color: "#10b981" },
      { name: "Tasks", value: tasks, color: "#f59e0b" },
    ];

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Daily Mood (from Journal)
app.get("/analytics/daily-mood", authenticateJWT, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.userID });
    const data = journals.map(j => ({
      day: j.date.toISOString().slice(0, 10),
      mood: ["sad", "neutral", "stressed", "happy"].indexOf(j.mood) + 1,
      energy: 5 // placeholder
    }));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/analytics/stats", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userID;

    // Total Focus Time (assuming Pomodoro schema has `duration` in minutes)
    const pomodoros = await Pomodoro.find({ userId });
    const totalFocusMinutes = pomodoros.reduce((sum, p) => sum + (p.duration || 0), 0);
    const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

    // Completed Sessions (count pomodoros)
    const completedSessions = pomodoros.length;

    // Meditation Minutes (assuming Meditation schema has `duration` in minutes)
    const meditations = await Meditation.find({ userId });
    const meditationMinutes = meditations.reduce((sum, m) => sum + (m.duration || 0), 0);

    // Tasks Completed
    const tasksCompleted = await Task.countDocuments({ userId, status: "completed" });

    res.json({
      totalFocusTime: totalFocusHours,     
      completedSessions,                   
      meditationMinutes,                   
      tasksCompleted                       
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/analytics/achievements", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userID;

    const pomodoroCount = await Pomodoro.countDocuments({ userId });
    const meditationStreak = await Meditation.countDocuments({ userId }); // you could also track streak
    const tasksCompleted = await Task.countDocuments({ userId, status: "completed" });

    let achievements = [];

    // Example dynamic rules
    if (pomodoroCount >= 50) {
      achievements.push({
        title: "Focus Master",
        description: "Completed 50 focus sessions",
        emoji: "🎯",
        date: "Recently"
      });
    }

    if (meditationStreak >= 7) {
      achievements.push({
        title: "Mindful Week",
        description: "Meditated 7 days in a row",
        emoji: "🧘‍♀️",
        date: "Recently"
      });
    }

    if (tasksCompleted >= 100) {
      achievements.push({
        title: "Task Crusher",
        description: "Completed 100 tasks",
        emoji: "✅",
        date: "Recently"
      });
    }

    // Example: early bird (if sessions before 9 AM exist)
    const earlySessions = await Pomodoro.find({
      userId,
      startTime: { $exists: true, $ne: null }
    });

    if (earlySessions.some(s => new Date(s.startTime).getHours() < 9)) {
      achievements.push({
        title: "Early Bird",
        description: "Started 5 morning sessions",
        emoji: "🌅",
        date: "Recently"
      });
    }

    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port,()=>{
    console.log(`Listening on Port ${port}`);
});