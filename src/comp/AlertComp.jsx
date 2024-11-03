import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const sounds = [
  { name: "sound1", value: "sound1.mp3" },
  { name: "sound2", value: "sound2.mp3" },
  { name: "sound3", value: "sound3.mp3" },
  { name: "sound4", value: "sound4.mp3" },
  { name: "sound5", value: "sound5.mp3" },
  { name: "sound6", value: "sound6.mp3" },
  { name: "sound7", value: "sound7.mp3" },
];

export default function AlertComp({ open, onClose, handleSaveAlert }) {
  const [selectedTime, setSelectedTime] = useState(5);
  const [selectedSound, setSelectedSound] = useState(sounds[4].value);
  const audioRef = useRef(null);

  // Handle sound preview
  const handleSoundPreview = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop the current audio
    }
    audioRef.current = new Audio(`/sounds/${soundFile}`);
    audioRef.current.play();
  };

  //Handle close button
  const handleCloseClick = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop audio when cancelling
    }

    onClose();
  };

  // Handle save button
  const handleSaveAlertClick = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop audio when saving
    }

    // Save alert time and sound in local storage
    localStorage.setItem("alertTime", selectedTime);
    localStorage.setItem("alertSound", selectedSound);

    // Close the dialog and invoke handleSaveAlert to pass the values back
    handleSaveAlert(selectedTime, selectedSound);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>הוספת התראה</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>זמן</InputLabel>
          <Select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((time) => (
              <MenuItem key={time} value={time}>
                {time} דקות
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>צליל</InputLabel>
          <Select
            value={selectedSound}
            onChange={(e) => {
              setSelectedSound(e.target.value);
              handleSoundPreview(e.target.value); // Play sound when selected
            }}
          >
            {sounds.map((sound) => (
              <MenuItem key={sound.value} value={sound.value}>
                {sound.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick}>בטל</Button>
        <Button onClick={handleSaveAlertClick}>שמור</Button>
      </DialogActions>
    </Dialog>
  );
}
