import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";

const UserEventsComponent = ({ open, onClose }) => {
  const [events, setEvents] = useState([]);

  // Load events from local storage
  useEffect(() => {
    const storedEvents =
      JSON.parse(localStorage.getItem("SpecialEvents")) || [];
    
    // Convert events to the required format
    const formattedEvents = storedEvents.map(event => ({
      id: String(event.id), // Ensure this is a string
      title: event.title,
      start: new Date(event.start).toISOString(), // ISO string
      end: new Date(event.end).toISOString(), // ISO string
      description: event.description,
    }));

    console.log("Formatted Events:", formattedEvents); // Debugging

    setEvents(formattedEvents);
  }, []);

  const plugins = [
    createEventsServicePlugin(),
    createDragAndDropPlugin({
      onDrop: (updatedEvents) => {
        setEvents(updatedEvents);
        localStorage.setItem("SpecialEvents", JSON.stringify(updatedEvents));
      },
    }),
  ];

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    plugins,
  });

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>האירועים</DialogTitle>
      <DialogContent>
        <ScheduleXCalendar calendarApp={calendar} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick}>X</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEventsComponent;
