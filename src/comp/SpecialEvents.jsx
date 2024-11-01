import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker"; // Import TimePicker

export default function SpecialEvents({
  open,
  onClose,
  handleSaveSpecialEvents,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState(null); // Start time state
  const [endTime, setEndTime] = useState(null); // End time state

  // Handle date selection
  const handleDateChange = (date) => {
    console.log("Selected Date from DatePicker:", date); // Log selected date
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle event title change
  const handleTitleChange = (event) => {
    setEventTitle(event.target.value);
  };

  // Handle start time change
  const handleStartTimeChange = (time) => {
    setStartTime(time);
  };

  // Handle end time change
  const handleEndTimeChange = (time) => {
    setEndTime(time);
  };

  // Handle save button
  const handleSaveSpecialEventsClick = () => {
    if (selectedDate && eventTitle && startTime && endTime) {
      // Retrieve existing events from local storage or initialize as an empty array
      const storedEvents =
        JSON.parse(localStorage.getItem("SpecialEvents")) || [];

      // Create a new event object
      const localDate = new Date(selectedDate);
      const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));

      // Combine date and time to create the full start and end times
      const startDateTime = new Date(utcDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

      const endDateTime = new Date(utcDate);
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

      const newEvent = {
        id: storedEvents.length + 1, // Assign a unique id based on the number of stored events
        title: eventTitle,
        start: startDateTime.toISOString(), // Save as ISO string
        end: endDateTime.toISOString(),     // Save as ISO string
        description: "", // You can add a description field if needed
      };

      // Log the new event before saving
      console.log("New Event to be saved:", newEvent);

      // Update the local storage array
      const updatedEvents = [...storedEvents, newEvent];
      localStorage.setItem("SpecialEvents", JSON.stringify(updatedEvents));

      // Clear input fields after saving
      setSelectedDate(null);
      setEventTitle("");
      setStartTime(null);
      setEndTime(null);

      // Close the dialog and invoke handleSaveSpecialEvents to update the parent component
      handleSaveSpecialEvents(updatedEvents);
    }
  };

  // Handle close button
  const handleCloseClick = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>הוספת אירוע מיוחד</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="כותרת האירוע"
          value={eventTitle}
          onChange={handleTitleChange}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="תאריך"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          {/* Start Time Picker */}
          <FormControl fullWidth margin="normal">
            <TimePicker
              label="שעת התחלה"
              value={startTime}
              onChange={handleStartTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          {/* End Time Picker */}
          <FormControl fullWidth margin="normal">
            <TimePicker
              label="שעת סיום"
              value={endTime}
              onChange={handleEndTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick}>בטל</Button>
        <Button onClick={handleSaveSpecialEventsClick}>שמור</Button>
      </DialogActions>
    </Dialog>
  );
}
