import React, { useEffect, useState } from "react";
import "./Parasha.css";
export default function Parasha() {
  const [parasha, setParasha] = useState("לא זמין"); // State to store parasha information

  useEffect(() => {
    const storedData = localStorage.getItem("shabbatTimes"); // Fetch stored data

    if (storedData) {
      const parsedData = JSON.parse(storedData); // Parse the data
      setParasha(parsedData.parasha);
    }
  }, []);

  return (
    <div className="parasha">
      <p className="title">פרשת השבוע</p>
      <p className="parasha-text">{parasha}</p>
    </div>
  );
}
