// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../Components/imageCarousel";

import casa1 from "../assets/images/Casa_1.jpg";
import casa2 from "../assets/images/Casa_2.jpeg";
import casa3 from "../assets/images/Casa_3.jpg";
import casa4 from "../assets/images/Casa_4.jpg";
import casa5 from "../assets/images/Casa_5.jpg";
import casa6 from "../assets/images/Casa_6.jpg";

const Home = () => {
  const navigate = useNavigate();

  const images = [casa1, casa2, casa3, casa4, casa5, casa6  ];

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <div>
        <h2>Propiedades Destacadas</h2>
        <ImageCarousel images={images} />
      </div>
    </div>
  );
};

export default Home;
