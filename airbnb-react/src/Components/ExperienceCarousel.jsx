import React, { useRef } from "react";
import Slider from "react-slick";
import ExperienceCard from "./ExperienceCard";
import "./ExperienceCarousel.css";

const ExperienceCarousel = ({ experiencias }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="carousel-wrapper">
      <button onClick={() => sliderRef.current.slickPrev()} className="carousel-btn prev">◀</button>
      <button onClick={() => sliderRef.current.slickNext()} className="carousel-btn next">▶</button>

      <Slider ref={sliderRef} {...settings}>
        {experiencias.map((exp, i) => (
          <ExperienceCard key={i} experiencia={exp} />
        ))}
      </Slider>
    </div>
  );
};

export default ExperienceCarousel;
