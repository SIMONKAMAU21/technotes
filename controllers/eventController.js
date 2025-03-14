import {
  sendBadRequest,
  sendCreated,
  sendDeleteSuccess,
  sendNotFound,
  sendServerError,
} from "../helpers/helperFunctions.js";
import { io } from "../index.js";
import Event from "../model/eventModal.js";

export const addEvent = async (req, res) => {
  const { title, start, end } = req.body;
  try {
    // Check if an event with the same title and date already exists
    const eventExists = await Event.findOne({ title, start }).lean().exec();
    if (eventExists) {
      return sendBadRequest(res, "Event already exists");
    }

    // Create a new event
    const newEvent = new Event({
      title,
      start: new Date(start),
      end: new Date(end),
      createdBy: req.user.id, // Assuming Auth middleware sets req.event
    });
    // Save event to the database
    await newEvent.save();
    io.emit("eventAdded", newEvent);
    // Send a success response
    sendCreated(res, "Event created successfully", newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const event = await Event.find({}).populate("createdBy", "role name"); // Fetch creator details

    if (!event || event.length === 0) {
      return sendNotFound(res, "No event found");
    } else {
      return res.status(200).json(event);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
  return sendNotFound(res, "event not found");
  }
  if (event) {
    await event.deleteOne();
    io.emit("eventDeleted", { eventId: req.params.id });
    sendDeleteSuccess(res, "event deleted successfully");
  } else {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params; // Get the event ID from the request parameters
  const { title, start, end } = req.body; // Destructure updated fields from the request body

  try {
    // Check if the event exists
    const event = await Event.findById(id).exec();
    if (!event) {
      return sendNotFound(res, "event not found");
    }

    // Update fields only if they are provided
    if (title) event.title = title;
    if (start) event.start = start;
    if (end) event.end = end;

    // Save the updated event to the database
    const updatedEvent = await event.save();
    io.emit("eventUpdated", updatedEvent);
    res.status(200).json({
      message: "event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
