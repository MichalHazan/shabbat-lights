// src/components/ShabbatDisplay.js
import React, { useEffect, useState } from "react";
import { calculateShabbatTimes, fetchUserLocation } from "./utils/shabbatUtils";

const Test = () => {
  const [shabbatInfo, setShabbatInfo] = useState(null);
  const [city, setCity] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const locationData = await fetchUserLocation();
      setCity(locationData.city);
      const shabbatData = await calculateShabbatTimes(
        locationData.latitude,
        locationData.longitude,
        locationData.city
      );
      const closestShabbat = findClosestShabbat(shabbatData[locationData.city]);
      setShabbatInfo(closestShabbat);
    };

    fetchData();
  }, []);
  // Function to parse 'dd/mm/yy' string into Date object
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(`20${year}`, month - 1, day); // Adjust year and month
  };

  // Function to find the closest Shabbat from the shabbatData array
  const findClosestShabbat = (shabbatData) => {
    const today = new Date();

    // Filter the data for dates that are >= today
    const upcomingShabbats = shabbatData.filter((item) => {
      const itemDate = parseDate(item.date);
      return itemDate >= today;
    });

    if (upcomingShabbats.length === 0) return null; // No upcoming Shabbat found

    // Find the Shabbat with the closest date to today
    return upcomingShabbats.reduce((prev, curr) => {
      const prevDate = parseDate(prev.date);
      const currDate = parseDate(curr.date);
      return currDate < prevDate ? curr : prev;
    });
  };

  if (!shabbatInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>{city} Shabbat Times</h3>
      <div>
        <h3>{city} Closest Shabbat</h3>
        <p>Date: {shabbatInfo.date}</p>
        <p>Candle Lighting: {shabbatInfo.candle_lighting}</p>
        <p>Havdalah: {shabbatInfo.havdalah}</p>
        <p>Torah Portion (Hebrew): {shabbatInfo.torah_hw}</p>
        <p>Torah Portion (English): {shabbatInfo.torah_en}</p>
      </div>
    </div>
  );
};

export default Test;
