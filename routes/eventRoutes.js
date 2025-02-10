import express from "express";
import { createEvent, getEvents, attendEvent, leaveEvent } from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new event (Protected Route)
router.post("/", authMiddleware, createEvent);

// ✅ Get all events (Public Route)
router.get("/", getEvents);

// ✅ Attend an event (Protected Route)
router.post("/:id/attend", authMiddleware, attendEvent);

// ✅ Leave an event (Protected Route)
router.post("/:id/leave", authMiddleware, leaveEvent);

export default router;
