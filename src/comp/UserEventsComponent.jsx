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
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop"; // Import the drag-and-drop plugin
import "@schedule-x/theme-default/dist/index.css";

const UserEventsComponent = ({ open, onClose }) => {
  const [events, setEvents] = useState([]);

  // Load events from local storage
  useEffect(() => {
    const storedEvents =
      JSON.parse(localStorage.getItem("SpecialEvents")) || [];
    setEvents(storedEvents);
  }, []);

  const plugins = [
    createEventsServicePlugin(),
    createDragAndDropPlugin({
      onDrop: (updatedEvents) => {
        // Save updated events to state and local storage after drag-and-drop
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
    events, // Pass events directly
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
