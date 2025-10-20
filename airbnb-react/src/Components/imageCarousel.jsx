import React, { useRef } from "react";
import Slider from "react-slick";
import "./ImageCarousel.css";

const ImageCarousel = ({ images }) => {
const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // número de imágenes visibles
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 }},
      { breakpoint: 600, settings: { slidesToShow: 1 }},
    ],
  };


  return (
    <div className="carousel-container">
      <button onClick={() => sliderRef.current.slickPrev()} className="carousel-btn prev">◀</button>
      <button onClick={() => sliderRef.current.slickNext()} className="carousel-btn next">▶</button>

      <Slider ref={sliderRef} {...settings}>
        {images.map((img, index) => (
          <div key={index} className="carousel-slide">
            <img src={img} alt={`Slide ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
