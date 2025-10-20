import React from "react";
import ExperienceCarousel from "../Components/ExperienceCarousel";
import Museo from "../assets/images/Experiencias/Museo_Regional.jpg";
import Teatro from "../assets/images/Experiencias/Tour_del_Teatro_Degollado.jpg";
import Tequila from "../assets/images/Experiencias/Tour_Tequila_JoseCuervo.jpeg";
import Zoologico from "../assets/images/Experiencias/Tour_Zoologico_GDL.jpeg";
import Centro from "../assets/images/Experiencias/Tour_Guadalajara.jpg";
import Catedral from "../assets/images/Experiencias/VisitalaCatedral.jpg";
import Tlaquepaque from "../assets/images/Experiencias/Visita_Tlaquepaque.jpg";

const experiencias = [
  {
    imagen: Museo,
    titulo: "Museo Regional de Guadalajara",
    ubicacion: "Guadalajara, México",
    precio: "$250",
    rating: 4.7,
  },
  {
    imagen: Teatro,
    titulo: "Visita el Teatro Degollado",
    ubicacion: "Guadalajara, México",
    precio: "$150",
    rating: 4.8,
  },
  {
    imagen: Tequila,
    titulo: "Tour A Tequila y Jose Cuervo",
    ubicacion: "Guadalajara, Tequila, Mexico",
    precio: "$1,450",
    rating: 5.0,
  },
  {
    imagen: Zoologico,
    titulo: "Tour y transporte al Zoologico de Guadalajara",
    ubicacion: "Guadalajara, México",
    precio: "$900",
    rating: 4.7,
  },
  {
    imagen: Centro,
    titulo: "Tour por el centro de Guadalajara",
    ubicacion: ", México",
    precio: "$600",
    rating: 5.0,
  },
    {
    imagen: Catedral,
    titulo: "Tour po la Catedral de Guadalajara",
    ubicacion: ", México",
    precio: "$100",
    rating: 5.0,
  },
    {
    imagen: Tlaquepaque,
    titulo: "Visita Tlaquepaque",
    ubicacion: "Guadalajara, Jalisco, México",
    precio: "$200",
    rating: 5.0,
  },
];

const Experiences = () => {
  console.log("Experiencias Cargadas");
  return (
    <div>
      <h2 style={{ padding: "2rem", textAlign: "center" }}>Experiencias populares en Guadalajara</h2>
      <ExperienceCarousel experiencias={experiencias} />
    </div>
  );
};

export default Experiences;