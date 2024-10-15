import React, { useEffect, useState } from "react";
import "./CandelsTimes.css";
export default function CandelsTimes() {
  const [shabbatTimes, setShabbatTimes] = useState({
    candleLighting: "",
    havdalah: "",
    parasha: "",
    candleLightingTime: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Get timezone from the user's current location
        const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Fetch Shabbat times with the user's coordinates and timezone
        fetchShabbatTimes(latitude, longitude, tzid);
      },
      (error) => {
        setError("Unable to retrieve your location.");
        console.error(error);
      }
    );
    const fetchShabbatTimes = async (latitude, longitude, tzid) => {
      const apiUrl = `https://www.hebcal.com/shabbat?cfg=json&geo=pos&latitude=${latitude}&longitude=${longitude}&tzid=${tzid}&M=on&b=20`;
      console.log(apiUrl);

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
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Find candle lighting, havdalah, and parasha times based on categories
        const candleLightingTime = data.items.find(
          (item) => item.category === "candles"
        )?.date;
        const havdalahTime = data.items.find(
          (item) => item.category === "havdalah"
        )?.date;
        // Attempt to find parashat; if not found, use item[2].hebrew
        const parasha =
          data.items.find((item) => item.category === "parashat")?.hebrew ||
          data.items[2]?.hebrew ||
          "לא זמין";

        // Format times
        const formattedCandleLighting = candleLightingTime
          ? new Date(candleLightingTime).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "לא זמין";
        const formattedHavdalah = havdalahTime
          ? new Date(havdalahTime).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "לא זמין";

        // Set the fetched times
        setShabbatTimes({
          candleLighting: formattedCandleLighting,
          havdalah: formattedHavdalah,
          parasha: parasha || "לא זמין", // Set parasha name or fallback
          candleLightingDate: candleLightingTime,
        });

        // Store in local storage
        localStorage.setItem(
          "shabbatTimes",
          JSON.stringify({
            candleLighting: formattedCandleLighting,
            havdalah: formattedHavdalah,
            parasha: parasha || "לא זמין",
            candleLightingDate: candleLightingTime,
          })
        );
        localStorage.setItem("shabbatTimesTime", currentTime.toString());
      } catch (err) {
        setError("Failed to fetch Shabbat times.");
        console.error(err);
      }
    };
  }, []);

  return (
    <div className="shabbat-container">
      <div className="shabbat-times">
        {error && <p className="error-message">{error}</p>}
        <p
          className="candle-lighting"
          dir="rtl"
        >{`הדלקת נרות: ${shabbatTimes.candleLighting}`}</p>
        <p
          className="havdalah"
          dir="rtl"
        >{`הבדלה: ${shabbatTimes.havdalah}`}</p>
      </div>
      <div className="shabbat-prayer">
        <p dir="rtl">
          “בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ
          בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת קֹדֶשׁ “
        </p>
      </div>
    </div>
  );
}
