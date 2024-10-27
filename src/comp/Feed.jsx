import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ImageComp from "./ImageComp";
import CandelsTimes from "./CandelsTimes";
import Parasha from './Parasha';
import AlertComp from './AlertComp';

export default function Feed() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [alertOpen, setAlertOpen] = useState(false); // State for alert dialog
  const [showImageComp, setShowImageComp] = useState(true);
  const [alertSettings, setAlertSettings] = useState({ time: null, sound: null }); // State to hold alert settings
  const [alertTriggered, setAlertTriggered] = useState(false);
  const soundRef = useRef(null); // Reference to hold the audio object


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddAlert = () => {
    setAlertOpen(true); // Open the alert dialog
    setAnchorEl(null);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false); // Close the alert dialog
  };

  const toggleComponent = () => {
    setShowImageComp((prev) => !prev);
  };

  const handleSave = (selectedTime, selectedSound) => {
    setAlertSettings({ time: selectedTime, sound: selectedSound }); // Save alert settings
    setAlertOpen(false); // Close the AlertComp dialog after saving
  };

  // Effect to handle alert logic
  useEffect(() => {
    if (alertSettings.time !== null && alertSettings.sound) {
      // Get the current candle lighting time from local storage
      const shabbatTimes = JSON.parse(localStorage.getItem('shabbatTimes'));
      const candleLightingTime = new Date(shabbatTimes.candleLightingDate); // Time for candle lighting
      const alertTime = new Date(candleLightingTime.getTime() - alertSettings.time * 60000); // Time for the alert

      const timeUntilAlert = alertTime.getTime() - new Date().getTime();

      if (timeUntilAlert > 0) {
        // Schedule the sound to play 30 seconds before the alert
        const soundTimeout = setTimeout(() => {
          soundRef.current = new Audio(`/sounds/${alertSettings.sound}`);
          soundRef.current.play().catch((error) => console.error('Error playing sound:', error));
        }, timeUntilAlert - 10000); // 30 seconds before alert

        // Schedule the alert dialog to appear at the exact time
        const alertTimeout = setTimeout(() => {
          setAlertTriggered(true);
        }, timeUntilAlert);

        return () => {
          clearTimeout(soundTimeout);
          clearTimeout(alertTimeout);
        };
      }
    }
  }, [alertSettings]); // Dependency array to rerun effect when alertSettings change

   // Effect to stop sound after clicking "OK"
   useEffect(() => {
    if (!alertTriggered) return; // Only trigger if the alert was shown

    const handleStopSound = () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null; // Reset the audio ref
      }
      setAlertTriggered(false); // Reset the alert state
    };

    // Show the alert to the user
    alert('תכף הזמן להדליק נרות שבת'); // This will wait until the user clicks "OK"
    handleStopSound(); // Stop the sound after the alert is dismissed

  }, [alertTriggered]);

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to top, #ccb3fc, #fdeff9)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative",
      }}
    >
      <IconButton
        aria-label="more"
        aria-controls={openMenu ? "menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          position: "absolute",
          top: 2,
          right: 1,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu id="menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={handleAddAlert}>הוסף התראה</MenuItem>
      </Menu>

      {/* Render the AlertComp dialog */}
      <AlertComp open={alertOpen} onClose={handleCloseAlert} handleSave={handleSave} />

      <Grid container spacing={2}>
        <Grid item xs={5}>
          {showImageComp ? <ImageComp /> : <Parasha />}
        </Grid>
        <Grid item xs={7}>
          <CandelsTimes />
        </Grid>
      </Grid>

      <IconButton
        onClick={toggleComponent}
        sx={{
          position: 'absolute',
          bottom: 55,
          left: 16,
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <CompareArrowsIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
