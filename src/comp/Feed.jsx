import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ImageComp from "./ImageComp";
import CandelsTimes from "./CandelsTimes";
import Parasha from "./Parasha";
import AlertComp from "./AlertComp";
import SpecialEvents from "./SpecialEvents";
import bricks from "../images/bricks.jpeg";

const sounds = [
  { name: "sound1", value: "sound1.mp3" },
  { name: "sound2", value: "sound2.mp3" },
  { name: "sound3", value: "sound3.mp3" },
  { name: "sound4", value: "sound4.mp3" },
  { name: "sound5", value: "sound5.mp3" },
  { name: "sound6", value: "sound6.mp3" },
  { name: "sound7", value: "sound7.mp3" },
];

export default function Feed() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [alertOpen, setAlertOpen] = useState(false);
  const [showImageComp, setShowImageComp] = useState(true);
  const [alertSettings, setAlertSettings] = useState({
    time: null,
    sound: null,
  });
  const [alertTriggered, setAlertTriggered] = useState(false);
  const soundRef = useRef(null);
  const [specialEventsOpen, setSpecialEventsOpen] = useState(false);
  const [specialEventsSettings, setSpecialEventsSettings] = useState([]);
  const [specialEventsTriggered, setSpecialEventsTriggered] = useState(false);
  const [specialEventTitle, setSpecialEventTitle] = useState("");
  const checkEventIntervalRef = useRef(null);
  const [playedEvents, setPlayedEvents] = useState(new Set()); // Track played events

  // Helper function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return (
      compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to play sound
  const playSound = async (soundFile) => {
    try {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null;
      }
      
      const sound = new Audio(`/sounds/${soundFile}`);
      sound.addEventListener('canplaythrough', () => {
        soundRef.current = sound;
        sound.play().catch(error => console.error("Error playing sound:", error));
      });
      
      sound.addEventListener('error', (e) => {
        console.error("Error loading sound:", e);
      });
    } catch (error) {
      console.error("Error setting up sound:", error);
    }
  };

   // Check for today's events
   const checkTodayEvents = () => {
    const todayEvent = specialEventsSettings.find(event => isToday(event.start));
    if (todayEvent) {
      setSpecialEventTitle(todayEvent.title);
      
      // Only play sound if this event hasn't been played yet
      if (!playedEvents.has(todayEvent.id) && todayEvent.sound) {
        setSpecialEventsTriggered(true);
        playSound(todayEvent.sound);
        // Add this event to the played events set
        setPlayedEvents(prev => new Set([...prev, todayEvent.id]));
      }
    } else {
      // Reset everything except the title when there's no event today
      setSpecialEventsTriggered(false);
      setSpecialEventTitle("");
      setPlayedEvents(new Set()); // Reset played events for the next day
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null;
      }
    }
  };

  // Effect to handle special events
  useEffect(() => {
    checkTodayEvents();
    
    // Check every minute for new events
    checkEventIntervalRef.current = setInterval(checkTodayEvents, 60000);

    return () => {
      if (checkEventIntervalRef.current) {
        clearInterval(checkEventIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null;
      }
    };
  }, [specialEventsSettings]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddAlert = () => {
    setAlertOpen(true);
    setAnchorEl(null);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSaveAlert = (selectedTime, selectedSound) => {
    setAlertSettings({ time: selectedTime, sound: selectedSound });
    setAlertOpen(false);
  };

  const handleAddSpecialEvents = () => {
    setSpecialEventsOpen(true);
    setAnchorEl(null);
  };

  const handleCloseSpecialEvents = () => {
    setSpecialEventsOpen(false);
  };

  const handleSaveSpecialEvents = (updatedEvents) => {
    setSpecialEventsSettings(updatedEvents);
    setSpecialEventsOpen(false);
  };

  const handleStopEventSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current = null;
    }
    setSpecialEventsTriggered(false);
  };

  const toggleComponent = () => {
    setShowImageComp((prev) => !prev);
  };

  // Effect to handle alert logic
  useEffect(() => {
    if (alertSettings.time !== null && alertSettings.sound) {
      const shabbatTimes = JSON.parse(localStorage.getItem("shabbatTimes"));
      if (!shabbatTimes?.candleLightingDate) return;

      const candleLightingTime = new Date(shabbatTimes.candleLightingDate);
      const alertTime = new Date(
        candleLightingTime.getTime() - alertSettings.time * 60000
      );
      const timeUntilAlert = alertTime.getTime() - new Date().getTime();

      if (timeUntilAlert > 0) {
        const soundTimeout = setTimeout(() => {
          playSound(alertSettings.sound);
        }, timeUntilAlert - 10000);

        const alertTimeout = setTimeout(() => {
          setAlertTriggered(true);
        }, timeUntilAlert);

        return () => {
          clearTimeout(soundTimeout);
          clearTimeout(alertTimeout);
        };
      }
    }
  }, [alertSettings]);

  useEffect(() => {
    if (!alertTriggered) return;

    alert("תכף הזמן להדליק נרות שבת");
    handleStopEventSound();
  }, [alertTriggered]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${bricks})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative",
        paddingRight: "0",
      }}
    >
      {specialEventTitle && (
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
          {specialEventTitle}
        </Typography>
      )}
      
      {specialEventsTriggered && (
        <Dialog open={specialEventsTriggered} onClose={handleStopEventSound}>
          <DialogTitle>{specialEventTitle}</DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button onClick={handleStopEventSound} color="primary">
              עצור
            </Button>
          </DialogActions>
        </Dialog>
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
          zIndex: "4",
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

      <AlertComp
        open={alertOpen}
        onClose={handleCloseAlert}
        handleSaveAlert={handleSaveAlert}
      />
      
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