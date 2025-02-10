import Event from "../models/Event.js";
import User from "../models/User.js";
export const createEvent = async (req, res) => {
    try {
      const { name, description, date } = req.body;
  
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const event = new Event({
        name,
        description,
        date,
        owner: req.user.id, // Assign event to user
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error creating event" });
    }
  };

export const getEvents = async (req, res) => {
    try {
      const events = await Event.find();
      const currentDate = new Date();
  
      const upcomingEvents = events.filter((event) => new Date(event.date) >= currentDate);
      const pastEvents = events.filter((event) => new Date(event.date) < currentDate);
  
      res.json({ upcomingEvents, pastEvents });
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  };

export const attendEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event.attendees.includes(req.user.id)) {
    event.attendees.push(req.user.id);
    await event.save();
  }
  res.json(event);
};

export const leaveEvent = async (req, res) => {
    try {
      const { id: eventId } = req.params; // Get event ID from URL
      const userId = req.user.id; // Get user ID from auth middleware
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Remove user from attendees list
      event.attendees = event.attendees.filter((attendee) => attendee.toString() !== userId);
      await event.save();
  
      res.status(200).json({ message: "You have left the event successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
