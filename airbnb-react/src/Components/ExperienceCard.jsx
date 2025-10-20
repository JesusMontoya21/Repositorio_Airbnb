import React from "react";
import "./ExperienceCarousel.jsx";

const ExperienceCard = ({ experiencia }) => {
  return (
    <div className="experience-card">
      <div className="image-container">
        <img src={experiencia.imagen} alt={experiencia.titulo} />
      </div>
      <div className="experience-info">
        <div className="info-top">
          <h3>{experiencia.titulo}</h3>
          <p>⭐ {experiencia.rating}</p>
        </div>
        <p className="location">{experiencia.ubicacion}</p>
        <p className="price">
          <strong>{experiencia.precio}</strong> / persona
        </p>
      </div>
    </div>
  );
};

export default ExperienceCard;
