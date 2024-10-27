import axios from "axios";
import SunCalc from "suncalc";

// Path to Torah Portions CSV (stored in the public directory)
const csvFilePath = `${process.env.PUBLIC_URL}/data/torahportions.csv`;

// Helper Functions
const adjustMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60000);

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Function to fetch and parse the Torah Portions CSV
const readTorahPortionsCSV = async () => {
  const response = await fetch(csvFilePath);
  const csvText = await response.text();
  const rows = csvText.split("\n");
  const results = rows.slice(1).map((row) => {
    const [date, torah_hw, torah_en] = row.split(",");
    return { date, torah_hw, torah_en };
  });
  return results;
};

// Calculate Fridays and Saturdays for the next year
const getNextYearFridaysAndSaturdays = () => {
  const fridays = [];
  const saturdays = [];
  const today = new Date();
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 2);

  for (
    let currentDate = new Date(today);
    currentDate <= oneYearLater;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 5) fridays.push(new Date(currentDate));
    else if (dayOfWeek === 6) saturdays.push(new Date(currentDate));
  }

  return { fridays, saturdays, currentYear: today.getFullYear() };
};

// Function to calculate Shabbat times and Torah portions based on location
export const calculateShabbatTimes = async (
  latitude,
  longitude,
  locationName
) => {
  const { fridays, saturdays, currentYear } = getNextYearFridaysAndSaturdays();
  const fileName = `${locationName
    .replace(/\s/g, "")
    .toLowerCase()}${currentYear}.json`;

  // Check if the JSON file already exists in local storage
  if (localStorage.getItem(fileName)) {
    console.log(`${fileName} exists`);
    return JSON.parse(localStorage.getItem(fileName));
  }

  try {
    const torahPortions = await readTorahPortionsCSV();
    const shabbatTimes = [];

    for (let i = 0; i < fridays.length; i++) {
      const friday = fridays[i];
      const saturday = saturdays[i];

      // Get sunset times for Friday and Saturday at the user's location
      const fridaySunTimes = SunCalc.getTimes(friday, latitude, longitude);
      const saturdaySunTimes = SunCalc.getTimes(saturday, latitude, longitude);

      // Calculate candle lighting time and Havdalah time
      const candleLightingTime = adjustMinutes(fridaySunTimes.sunset, -34);
      const havdalahTime = adjustMinutes(saturdaySunTimes.sunset, 37);

      // Find matching Torah portion from CSV by date
      const torahPortion = torahPortions.find((portion) => {
        const [day, month, year] = portion.date.split("/");
        const portionDate = new Date(`${year}-${month}-${day}`);
        return portionDate.toDateString() === saturday.toDateString();
      });

      shabbatTimes.push({
        date: formatDate(saturday),
        candle_lighting: candleLightingTime.toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        havdalah: havdalahTime.toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        torah_hw: torahPortion ? torahPortion.torah_hw : "",
        torah_en: torahPortion ? torahPortion.torah_en : "",
      });
    }

    // Save results to local storage
    localStorage.setItem(
      fileName,
      JSON.stringify({ [locationName]: shabbatTimes })
    );
    console.log(`Shabbat times saved to ${fileName}`);

    return { [locationName]: shabbatTimes };
  } catch (error) {
    console.error("Error calculating Shabbat times:", error);
    return null;
  }
};

// Fetch user's location based on IP address
export const fetchUserLocation = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    const { latitude, longitude, city } = response.data;

    if (latitude && longitude) {
      console.log(`Location detected: ${city} (${latitude}, ${longitude})`);
      return { latitude, longitude, city };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    console.warn("Using Default city: Jerusalem");
    return {
      latitude: 31.7683,
      longitude: 35.2137,
      city: "Jerusalem",
    };
  }
};

export const getCityName = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.address) {
      // Extract city, town, or village from the response
      const locationName =
        data.address.city || data.address.town || data.address.village;

      if (locationName) {
        localStorage.setItem("cityName", locationName);
        return locationName;
      } else {
        return `${latitude}lalo${longitude}`;
      }
    } else {
      return `${latitude}lalo${longitude}`;
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    // If error occurs, set locationName to "byll"
    return `${latitude}lalo${longitude}`;
  }
};
