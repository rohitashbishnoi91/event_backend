import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import Event from "./models/Event.js"; // Import Event model

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Root Route - Server Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ✅ WebSockets (Real-time Attendee Updates)
io.on("connection", (socket) => {
  console.log("🔗 A user connected:", socket.id);

  socket.on("joinEvent", async ({ eventId, user }) => {
    try {
      const event = await Event.findById(eventId);
      if (!event) return socket.emit("error", "Event not found");

      // Add user to attendees list if not already in
      if (!event.attendees.includes(user.id)) {
        event.attendees.push(user.id);
        await event.save();
      }

      io.to(eventId).emit("updateAttendees", {
        eventId,
        attendees: event.attendees.length,
      });

      console.log(`✅ ${user.name} joined event ${eventId}`);
    } catch (error) {
      console.error("Join Event Error:", error);
      socket.emit("error", "Failed to join event");
    }
  });

  socket.on("leaveEvent", async ({ eventId, user }) => {
    try {
      const event = await Event.findById(eventId);
      if (!event) return socket.emit("error", "Event not found");

      // Remove user from attendees list
      event.attendees = event.attendees.filter((id) => id !== user.id);
      await event.save();

      io.to(eventId).emit("updateAttendees", {
        eventId,
        attendees: event.attendees.length,
      });

      console.log(`❌ ${user.name} left event ${eventId}`);
    } catch (error) {
      console.error("Leave Event Error:", error);
      socket.emit("error", "Failed to leave event");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
