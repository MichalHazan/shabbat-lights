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

export default function SpecialEvents({
  open,
  onClose,
  handleSaveSpecialEvents,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");

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

// Handle save button
const handleSaveSpecialEventsClick = () => {
    if (selectedDate && eventTitle) {
      // Retrieve existing events from local storage or initialize as an empty array
      const storedEvents =
        JSON.parse(localStorage.getItem("SpecialEvents")) || [];
  
      // Create a new event object
      const localDate = new Date(selectedDate);
      const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
  
      const newEvent = {
        date: utcDate.toISOString().split("T")[0], // Save date as YYYY-MM-DD in UTC
        title: eventTitle,
      };
  
      // Log the new event before saving
      console.log("New Event to be saved:", newEvent);
  
      // Update the local storage array
      const updatedEvents = [...storedEvents, newEvent];
      localStorage.setItem("SpecialEvents", JSON.stringify(updatedEvents));
  
      // Clear input fields after saving
      setSelectedDate(null);
      setEventTitle("");
  
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
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick}>בטל</Button>
        <Button onClick={handleSaveSpecialEventsClick}>שמור</Button>
      </DialogActions>
    </Dialog>
  );
}
