import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const sounds = [
  { name: "sound1", value: "sound1.mp3" },
  { name: "sound2", value: "sound2.mp3" },
  { name: "sound3", value: "sound3.mp3" },
  { name: "sound4", value: "sound4.mp3" },
  { name: "sound5", value: "sound5.mp3" },
  { name: "sound6", value: "sound6.mp3" },
  { name: "sound7", value: "sound7.mp3" },
];

export default function SpecialEvents({
  open,
  onClose,
  handleSaveSpecialEvents,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [selectedSound, setSelectedSound] = useState(sounds[4].value);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedDate(null);
      setEventTitle("");
      setStartTime(null);
      setSelectedSound(sounds[4].value);
      setError("");
    }
  }, [open]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSoundPreview = async (soundFile) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(`/sounds/${soundFile}`);
      await audio.play();
      audioRef.current = audio;
      
      // Cleanup after sound finishes playing
      audio.onended = () => {
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Error playing sound:", error);
      setError("Error playing sound preview");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setError(""); // Clear any existing errors
  };

  const handleTitleChange = (event) => {
    setEventTitle(event.target.value);
    setError(""); // Clear any existing errors
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setError(""); // Clear any existing errors
  };

  const validateEvent = () => {
    if (!eventTitle.trim()) {
      setError("Please enter an event title");
      return false;
    }
    if (!selectedDate) {
      setError("Please select a date");
      return false;
    }
    if (!startTime) {
      setError("Please select a time");
      return false;
    }
    return true;
  };

  const createEventDateTime = (date, time) => {
    const eventDate = new Date(date);
    const eventTime = new Date(time);
    
    return new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      eventTime.getHours(),
      eventTime.getMinutes()
    );
  };

  const handleSaveSpecialEventsClick = () => {
    if (!validateEvent()) return;

    try {
      const storedEvents = JSON.parse(localStorage.getItem("SpecialEvents")) || [];
      
      const eventDateTime = createEventDateTime(selectedDate, startTime);

      const newEvent = {
        id: Date.now(), // More reliable unique ID
        title: eventTitle.trim(),
        start: eventDateTime.toISOString(),
        sound: selectedSound,
        description: "",
      };

      // Check for duplicate events
      const isDuplicate = storedEvents.some(event => 
        new Date(event.start).getTime() === eventDateTime.getTime() &&
        event.title === newEvent.title
      );

      if (isDuplicate) {
        setError("An event with this date, time, and title already exists");
        return;
      }

      const updatedEvents = [...storedEvents, newEvent];
      localStorage.setItem("SpecialEvents", JSON.stringify(updatedEvents));

      // Stop any playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      handleSaveSpecialEvents(updatedEvents);
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Error saving event. Please try again.");
    }
  };

  const handleCloseClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseClick} maxWidth="sm" fullWidth>
      <DialogTitle>הוספת אירוע מיוחד</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="כותרת האירוע"
          value={eventTitle}
          onChange={handleTitleChange}
          error={!!error && !eventTitle}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="תאריך"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} error={!!error && !selectedDate} />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TimePicker
              label="שעה"
              value={startTime}
              onChange={handleStartTimeChange}
              renderInput={(params) => (
                <TextField {...params} error={!!error && !startTime} />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>צליל</InputLabel>
            <Select
              value={selectedSound}
              onChange={(e) => {
                setSelectedSound(e.target.value);
                handleSoundPreview(e.target.value);
              }}
            >
              {sounds.map((sound) => (
                <MenuItem key={sound.value} value={sound.value}>
                  {sound.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick}>בטל</Button>
        <Button 
          onClick={handleSaveSpecialEventsClick}
          disabled={!eventTitle || !selectedDate || !startTime}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
}