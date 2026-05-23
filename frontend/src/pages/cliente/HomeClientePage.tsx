import "../../styles/cliente/home-cliente.css";
import { useState } from "react";

import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { SearchBar } from "../../components/cliente/SearchBar";
import { CategoriaTabs } from "../../components/cliente/CategoriaTabs";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { Logo } from "../../components/logo";
export function HomeClientePage() {

  const [busqueda, setBusqueda] = useState("");

  const productos = [
    {
      nombre: "Coca Cola",
      precio: 15,
      imagen: "/decor/coca.jpg",
    },

    {
      nombre: "Pringles",
      precio: 18,
      imagen: "/decor/pringles.jpg",
      disponible: true,
      mostrarDisponibilidad: true,
    },

    {
      nombre: "Sprite",
      precio: 12,
      imagen: "/decor/sprite.jpg",
      cantidad: 2,
    },
  ];

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="home-cliente">

      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <SearchBar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      <CategoriaTabs />

      <section className="banner-novedades">
        <div>
          <h2>¡Novedades!</h2>
          <button>Ver</button>
        </div>
      </section>

      <section className="productos-grid">

        {productosFiltrados.map((producto) => (
          <ProductoCard
            key={producto.nombre}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            disponible={producto.disponible}
            //mostrarDisponibilidad={producto.mostrarDisponibilidad}
            cantidad={producto.cantidad}
          />
        ))}

      </section>

      <NavbarCliente paginaActiva="home" />

    </main>
  );
}