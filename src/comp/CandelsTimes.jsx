import React, { useEffect, useState } from "react";
import "./CandelsTimes.css";
import { calculateShabbatTimes, getCityName } from "../utils/shabbatUtils";
import { toJewishDate, formatJewishDateInHebrew } from "jewish-date";

export default function CandelsTimes() {
  const [shabbatTimes, setShabbatTimes] = useState({
    candleLighting: "",
    havdalah: "",
    parasha: "",
    candleLightingTime: null,
  });
  const [error, setError] = useState(null);
  const [shabbatInfo, setShabbatInfo] = useState(null);
  const date = new Date();
  const jewishDate = toJewishDate(date);
  const jewishDateInHebrewStr = formatJewishDateInHebrew(jewishDate);
  const todayf = new Date();
  const formattedDate = todayf.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const isShabbatPeriod = () => {
    const now = new Date();
    const fridayBeforeShabbat = new Date(shabbatTimes.candleLighting);
    const saturdayAfterShabbat = new Date(shabbatTimes.havdalah);
    return now >= fridayBeforeShabbat && now <= saturdayAfterShabbat;
  };

  const getMessageByDayAndTime = () => {
    const day = new Date().getDay();
    const now = new Date();
    const candleLightingTime = new Date(shabbatTimes.candleLighting);
    const havdalahTime = new Date(shabbatTimes.havdalah);

    if (day === 5 && now >= candleLightingTime) return "שבת שלום וסוף שבוע מבורך, מלא בחוויות נעימות ומרגיעות";
    if (day === 6 && now >= havdalahTime) return "שיהיה שבוע טוב מלא באור, שמחה והצלחה";

    switch (day) {
      case 0: return "שיהיה יום נפלא, מלא בהזדמנויות חדשות והגשמה עצמית";
      case 1: return "שהיום הזה יביא איתו רק בשורות טובות ורגעים מתוקים";
      case 2: return "שיהיה יום קסום, מלא באנרגיות טובות והישגים משמחים";
      case 3: return "שיהיה יום פורה ומוצלח, עם המון סיבות לחייך";
      case 4: return "שהיום הזה יהיה מלא בהפתעות נעימות ורגעים בלתי נשכחים";
      case 5: return now < candleLightingTime ? "שבת שלום וסוף שבוע מבורך, מלא בחוויות נעימות ומרגיעות" : "";
      default: return "";
    }
  };

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Save the location for offline use
          localStorage.setItem(
            "userLocation",
            JSON.stringify({ latitude, longitude })
          );

          // Fetch Shabbat times
          fetchShabbatTimes(latitude, longitude);
        },
        (error) => {
          setError(
            "Unable to retrieve your location. Using default location Jerusalem"
          );
          console.error(error);
          fetchShabbatTimesForDefaultLocation();
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      fetchShabbatTimesForDefaultLocation();
    }
  }, []);

  const fetchShabbatTimesForDefaultLocation = async () => {
    // Check if there's a location saved in localStorage
    const savedLocation = JSON.parse(localStorage.getItem("userLocation"));

    // Use a default location if geolocation fails Jerusalem
    const latitude = savedLocation ? savedLocation.latitude : 31.7683;
    const longitude = savedLocation ? savedLocation.longitude : 35.2137;
    await fetchShabbatTimes(latitude, longitude);
  };

  const fetchShabbatTimes = async (latitude, longitude) => {
    // Check local storage
    const storedData = localStorage.getItem("shabbatTimes");
    const storedTime = localStorage.getItem("shabbatTimesTime");
    const currentTime = new Date().getTime();

    // If data exists and is less than 2 days old, use it
    if (
      storedData &&
      storedTime &&
      currentTime - storedTime < 2 * 24 * 60 * 60 * 1000
    ) {
      setShabbatTimes(JSON.parse(storedData));
      return;
    }

    try {
      const cityName = localStorage.getItem("cityName")
        ? localStorage.getItem("cityName")
        : await getCityName(latitude, longitude);
      localStorage.setItem("cityName", cityName);
      const shabbatData = await calculateShabbatTimes(
        latitude,
        longitude,
        cityName
      );
      const closestShabbat = findClosestShabbat(shabbatData[cityName]);
      console.log(shabbatData[cityName]);
      console.log(closestShabbat);
      setShabbatInfo(closestShabbat); // Set the shabbatInfo here
    } catch (err) {
      setError("Failed to fetch Shabbat times.");
      console.error(err);
    }
  };

  // UseEffect to update shabbatTimes after shabbatInfo has been set
  useEffect(() => {
    if (shabbatInfo) {
      // Set the fetched times after shabbatInfo is updated
      setShabbatTimes({
        candleLighting: shabbatInfo.candle_lighting,
        havdalah: shabbatInfo.havdalah,
        parasha: shabbatInfo.torah_hw || "לא זמין",
        candleLightingDate: shabbatInfo.date,
      });

      // Store in local storage
      const currentTime = new Date().getTime();
      localStorage.setItem(
        "shabbatTimes",
        JSON.stringify({
          candleLighting: shabbatInfo.candle_lighting,
          havdalah: shabbatInfo.havdalah,
          parasha: shabbatInfo.torah_hw || "לא זמין",
          candleLightingDate: shabbatInfo.date,
        })
      );
      localStorage.setItem("shabbatTimesTime", currentTime.toString());
    }
  }, [shabbatInfo]); // Trigger this effect when shabbatInfo changes

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

  return (
    <div className="shabbat-container">
      <div className="orange-wave">
        <div className="wave-content">
          <div className="shabbat-times">
            <p>
              {" "}
              <span lang="he">{jewishDateInHebrewStr}</span> , {formattedDate}
            </p>

            {error && <p className="error-message">{error}</p>}
            <p className="candle-lighting">
              {`כניסת שבת${!isShabbatPeriod() ? " הקרובה" : ""}: ${
                shabbatTimes.candleLighting
              }`}
            </p>
            <p className="havdalah">
              {`יציאת שבת${!isShabbatPeriod() ? " הקרובה" : ""}: ${
                shabbatTimes.havdalah
              }`}
            </p>
          </div>
          <div className="shabbat-prayer">
            <p>{isShabbatPeriod() ? "ברוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת" : getMessageByDayAndTime()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
