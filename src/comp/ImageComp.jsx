import React, { useState, useEffect } from "react";
import "./ImageComp.css";
import candleImage from "../images/candle.png";

export default function ImageComp() {
  const [image, setImage] = useState(candleImage);
  const [text, setText] = useState("שבת שלום");

  // Load saved image and text from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("userImage");
    const savedText = localStorage.getItem("userText");

    if (savedImage) {
      setImage(savedImage); // Load saved image if it exists
    }

    if (savedText) {
      setText(savedText); // Load saved text if it exists
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem("userImage", reader.result); // Save image to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = () => {
    const newText = prompt("Enter new text:", text);
    if (newText) {
      setText(newText);
      localStorage.setItem("userText", newText); // Save text to localStorage
    }
  };

  return (
    <div className="image-comp">
      <label className="circle">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <img src={image} alt="Profile" className="profile-image" />
      </label>
      <p className="text" onClick={handleTextChange}>
        {text}
      </p>
    </div>
  );
}
