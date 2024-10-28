import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ImageComp from "./ImageComp";
import CandelsTimes from "./CandelsTimes";
import Parasha from "./Parasha";
import AlertComp from "./AlertComp";
import SpecialEvents from "./SpecialEvents";

export default function Feed() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [alertOpen, setAlertOpen] = useState(false); // State for alert dialog
  const [showImageComp, setShowImageComp] = useState(true);
  const [alertSettings, setAlertSettings] = useState({
    time: null,
    sound: null,
  }); // State to hold alert settings
  const [alertTriggered, setAlertTriggered] = useState(false);
  const soundRef = useRef(null); // Reference to hold the audio object
  const [specialEventsOpen, setSpecialEventsOpen] = useState(false); // State for SpecialEvents dialog
  const [specialEventsSettings, setSpecialEventsSettings] = useState([]); // State to hold SpecialEvents settings
  const [specialEventsTriggered, setSpecialEventsTriggered] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //Alert
  const handleAddAlert = () => {
    setAlertOpen(true); // Open the alert dialog
    setAnchorEl(null);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false); // Close the alert dialog
  };

  const handleSaveAlert = (selectedTime, selectedSound) => {
    setAlertSettings({ time: selectedTime, sound: selectedSound }); // Save alert settings
    setAlertOpen(false); // Close the AlertComp dialog after saving
  };
  //Special Events
  const handleAddSpecialEvents = (updatedEvents) => {
    setSpecialEventsOpen(true); // Open the SpecialEvents dialog
    setAnchorEl(null);
  };

  const handleCloseSpecialEvents = () => {
    setSpecialEventsOpen(false); // Close the SpecialEvents dialog
  };

  const handleSaveSpecialEvents = (updatedEvents) => {
    setSpecialEventsSettings(updatedEvents); // Update the specialEventsSettings with the new events
    setSpecialEventsOpen(false); // Close the SpecialEvents dialog after saving
  };
  // Effect to check if there's an event today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayEvent = specialEventsSettings.find(
      (event) => event.date === today
    );
    if (todayEvent) {
      // Display today's event title at the top of the page
      setSpecialEventsTriggered(todayEvent.title);
    } else {
      setSpecialEventsTriggered(false); // Clear the title if no event is today
    }
  }, [specialEventsSettings]);
  
  //toggle Component
  const toggleComponent = () => {
    setShowImageComp((prev) => !prev);
  };

  // Effect to handle alert logic
  useEffect(() => {
    if (alertSettings.time !== null && alertSettings.sound) {
      // Get the current candle lighting time from local storage
      const shabbatTimes = JSON.parse(localStorage.getItem("shabbatTimes"));
      const candleLightingTime = new Date(shabbatTimes.candleLightingDate); // Time for candle lighting
      const alertTime = new Date(
        candleLightingTime.getTime() - alertSettings.time * 60000
      ); // Time for the alert

      const timeUntilAlert = alertTime.getTime() - new Date().getTime();

      if (timeUntilAlert > 0) {
        // Schedule the sound to play 30 seconds before the alert
        const soundTimeout = setTimeout(() => {
          soundRef.current = new Audio(`/sounds/${alertSettings.sound}`);
          soundRef.current
            .play()
            .catch((error) => console.error("Error playing sound:", error));
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
    alert("תכף הזמן להדליק נרות שבת"); // This will wait until the user clicks "OK"
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
      {specialEventsTriggered && (
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px 0",
            fontWeight: "bold",
          }}
        >
          {specialEventsTriggered}
        </Typography>
      )}
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

      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleAddAlert}>הוסף התראה</MenuItem>
        <MenuItem onClick={handleAddSpecialEvents}>הוסף יום מיוחד</MenuItem>
      </Menu>
      
      {/* Render the AlertComp dialog */}
      <AlertComp
        open={alertOpen}
        onClose={handleCloseAlert}
        handleSaveAlert={handleSaveAlert}
      />
      {/* Render the SpecialEvents dialog */}
      <SpecialEvents
        open={specialEventsOpen}
        onClose={handleCloseSpecialEvents}
        handleSaveSpecialEvents={handleSaveSpecialEvents}
      />

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
          position: "absolute",
          bottom: 55,
          left: 16,
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <CompareArrowsIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
