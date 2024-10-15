import React, { useState } from 'react';
import './ImageComp.css'; 
import candleImage from '../images/candle.png';

export default function ImageComp() {
  const [image, setImage] = useState(candleImage);
  const [text, setText] = useState("שבת שלום");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = () => {
    const newText = prompt("Enter new text:", text);
    if (newText) {
      setText(newText);
    }
  };

  return (
    <div className="image-comp">
      <label className="circle">
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        <img src={image} alt="Profile" className="profile-image" />
      </label>
      <p className="text" onClick={handleTextChange}>
        {text}
      </p>
    </div>
  );
}
