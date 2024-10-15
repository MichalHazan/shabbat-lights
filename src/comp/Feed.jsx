import React, { useState } from "react";
import { Box, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ImageComp from "./ImageComp";
import CandelsTimes from "./CandelsTimes";
import Parasha from './Parasha';

export default function Feed() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showImageComp, setShowImageComp] = useState(true); // State to toggle components

  const toggleComponent = () => {
    setShowImageComp((prev) => !prev); // Toggle the component
  };

  const { t, i18n } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddAlert = () => {
    console.log("Add Alert clicked");
    setAnchorEl(null);
  };
{/*
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // Switch the language
    setAnchorEl(null);
  };
 */}

 
  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to top, #ccb3fc, #fdeff9)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative", // Make the Feed container relative
      }}
    >
      {/* IconButton for menu pinned to top-right of the entire Feed component */}
      <IconButton
        aria-label="more"
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          position: "absolute", // Absolute positioning within the Feed
          top: 2, // Adjust the top distance
          right: 1, // Adjust the right distance
        }}
      >
        <MoreVertIcon />
      </IconButton>

      {/* Menu component */}
      <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleAddAlert}>{t("menu.addAlert")}</MenuItem>
        {/*
        <MenuItem onClick={() => handleLanguageChange("he")}>
          {t("menu.hebrew")}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")}>
          {t("menu.english")}
        </MenuItem>
        */}
      </Menu>

     {/* Grid for ImageComp and CandelsTimes */}
     <Grid
        container
        spacing={2}
        sx={{
          marginLeft: 0, // Remove the negative margin
          marginRight: 0, // Ensure right margin is also adjusted
        }}
      >
          <Grid item xs={5}>
          {showImageComp ? <ImageComp /> : <Parasha />} {/* Toggle component */}
        </Grid>
        <Grid item xs={7}>
          <CandelsTimes />
        </Grid>
      </Grid>

      {/* Arrow button to switch components */}
      <IconButton
        onClick={toggleComponent}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          backgroundColor: '#fff', // Optional: background color for visibility
          '&:hover': {
            backgroundColor: '#f0f0f0', // Change color on hover
          },
        }}
      >
        <CompareArrowsIcon fontSize="small"/>
      </IconButton>
    </Box>
  );
}
