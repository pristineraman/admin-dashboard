// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/admin-dashboard",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  status: String,
});
const User = mongoose.model("User", userSchema);

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Kanban Task schema (add assignment, dueDate, priority, labels, checklist)
const taskSchema = new mongoose.Schema({
  content: String,
  status: String, // todo, doing, done
  attachments: [String], // file paths
  assignedTo: String, // user name or userId
  dueDate: Date,
  priority: { type: String, default: "normal" }, // low, normal, high
  labels: [String],
  checklist: [{ text: String, checked: Boolean }],
});
const Task = mongoose.model("Task", taskSchema);

// Calendar Event schema (add recurrence)
const eventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  recurrence: { type: String, default: "none" }, // none, daily, weekly, monthly
});
const Event = mongoose.model("Event", eventSchema);

// Activity Log schema
const activityLogSchema = new mongoose.Schema({
  user: String, // or userId if you want to reference users
  action: String,
  details: String,
  timestamp: { type: Date, default: Date.now },
});
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

// Log activity helper
async function logActivity({ user, action, details }) {
  await ActivityLog.create({ user, action, details });
}

// --- API ROUTES ---
// Auth: Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    // Validate input
    if (!name || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Create new user
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      password: hash,
      role: role || "user",
    });
    await user.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Auth: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user and validate password
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Auth middleware
function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (
        requiredRole &&
        decoded.role !== requiredRole &&
        decoded.role !== "admin"
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}

// Users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.post("/api/users", auth("admin"), async (req, res) => {
  const user = new User(req.body);
  await user.save();
  await logActivity({
    user: req.body.name,
    action: "create",
    details: `Created user ${user.name}`,
  });
  res.json(user);
});
// Get single user
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});
// Update user
app.put("/api/users/:id", auth("admin"), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  await logActivity({
    user: req.body.name,
    action: "update",
    details: `Updated user ${user.name}`,
  });
  res.json(user);
});
// Delete user
app.delete("/api/users/:id", auth("admin"), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  await logActivity({
    user: user?.name || "unknown",
    action: "delete",
    details: `Deleted user ${user?.name}`,
  });
  res.json({ success: true });
});

// Kanban Tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});
app.post("/api/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});
app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
});

// File upload setup
const upload = multer({
  dest: path.join(__dirname, "uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// File upload endpoint for Kanban tasks
app.post(
  "/api/tasks/:id/attachments",
  upload.single("file"),
  async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (!task.attachments) task.attachments = [];
    task.attachments.push(`/uploads/${req.file.filename}`);
    await task.save();
    res.json({ success: true, file: `/uploads/${req.file.filename}` });
  }
);

// Calendar Events
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  // Expand recurring events for the next 30 days
  const expanded = [];
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  for (const event of events) {
    if (event.recurrence === "none") {
      expanded.push(event);
    } else {
      let current = new Date(event.start);
      while (current <= in30) {
        const end = new Date(event.end);
        const diff = end - new Date(event.start);
        expanded.push({
          ...event.toObject(),
          start: new Date(current),
          end: new Date(current.getTime() + diff),
        });
        if (event.recurrence === "daily")
          current.setDate(current.getDate() + 1);
        else if (event.recurrence === "weekly")
          current.setDate(current.getDate() + 7);
        else if (event.recurrence === "monthly")
          current.setMonth(current.getMonth() + 1);
        else break;
      }
    }
  }
  res.json(expanded);
});
app.post("/api/events", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

// Activity log API
app.get("/api/activity-logs", async (req, res) => {
  const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
