import "../../styles/cliente/carrito-cliente.css";
import { useState } from "react";
import { Logo } from "../../components/logo";  
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import {SearchBar} from "../../components/cliente/SearchBar";
import { ProductoCard } from "../../components/cliente/ProductoCard";/////////////
import { CarritoItem } from "../../components/cliente/CarritoItem";

type Props = {
  onNavigate: (
    pagina: string
  ) => void;
};
export function CarritoClientePage({
  onNavigate
}: Props ) {
  const [busqueda, setBusqueda] = useState("");
  const productosExtra= [
  {
    id: 1,
    nombre: "Coca Cola",
    precio: 15,
    cantidad: 2,
    imagen: "/decor/coca.jpg"
  },

  {
    id: 2,
    nombre: "Pringles",
    precio: 18,
    cantidad: 1,
    imagen: "/decor/pringles.jpg"
  }
];
  const [productosEnCarrito, setProductosEnCarrito] = useState([
  {
    id: 3,
    nombre: "Oreo",
    precio: 15,
    cantidad: 2,
    imagen: "/decor/coca.jpg"
  },

  {
    id: 4,
    nombre: "Pipocas",
    precio: 18,
    cantidad: 1,
    imagen: "/decor/pringles.jpg"
  }
]);
  const productosEnCarritoFiltrados = productosEnCarrito.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  const productosExtraFiltrados = productosExtra.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  const [metodoPago, setMetodoPago] = useState("");
  const total = productosEnCarrito.reduce(
  (acc, producto) => acc + producto.precio * producto.cantidad,
  0
  );
  function aumentarCantidad(id: number) {
     setProductosEnCarrito((prev) =>
      prev.map((producto) =>
     producto.id === id ? {
        ...producto,
        cantidad: producto.cantidad + 1,
      }
      : producto
       )
     );
    }
 function disminuirCantidad(id: number) {
  setProductosEnCarrito((prev) =>
    prev.map((producto) =>
      producto.id === id
         ? {
            ...producto,
            cantidad:
              producto.cantidad > 1
                ? producto.cantidad - 1
                : 1,
          }
        : producto
    )
  );
}
function eliminarProducto(id: number) {
  setProductosEnCarrito((prev) =>
    prev.filter((producto) => producto.id !== id)
  );
}
  return (  
    <main className="carrito-cliente-page">

      <header className="cliente-header">
        <Logo width="260px" />
      </header>

     <PaginaActualC titulo="Carrito" />
     
     <SearchBar 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
     />  
     <p>  <span style ={{color:" #5f6164f7"}} >Combina tu orden con productos adicionales:</span></p>

     <section className="productos-extra">
       {productosExtraFiltrados.map((producto) => (
        <ProductoCard 
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            //mostrarDisponibilidad={producto.mostrarDisponibilidad}
            
        />
       ))}
     </section>
     <strong><span style ={{color:" #0a0a0a"}} >Tu Carrito </span></strong>
      {
      productosEnCarrito.length === 0 && (
      <p>Tu carrito está vacío</p>
       )
       }
     <section className="productos-carrito">
       {productosEnCarritoFiltrados.map((producto) => (
        <CarritoItem
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio} 
            cantidad={producto.cantidad}
            imagen={producto.imagen}
            onAumentar={() => aumentarCantidad(producto.id)}
            onDisminuir={() => disminuirCantidad(producto.id)}
            onEliminar={() => eliminarProducto(producto.id)}
        />
       )
       )}
     </section>    
    

     <strong>Total: Bs. {total}</strong>
     <p> <span style ={{color:" #787474ec", fontWeight: "lighter" }} > *no incluye envio</span></p>
     <p>Elija el metodo de pago antes del checkout: <span style ={{color:" #787474e0"}} ></span></p>
    
     <div className="metodos-pago">

       <label className="metodo-item">
        <input
           type="radio"
           name="metodoPago"
           value="EFECTIVO"
          checked={metodoPago === "EFECTIVO"}
            onChange={(e) => setMetodoPago(e.target.value)}
        />
        <span>Efectivo</span>
       </label>

        <label className="metodo-item">
         <input
            type="radio"
            name="metodoPago"
            value="QR"
            checked={metodoPago === "QR"}
            onChange={(e) => setMetodoPago(e.target.value)}
        />
         <span>QR</span>
        </label>

        <label className="metodo-item">
         <input
          type="radio"
          name="metodoPago"
          value="TARJETA"
          checked={metodoPago === "TARJETA"}
          onChange={(e) => setMetodoPago(e.target.value)}
        />
        <span>Tarjeta</span>
       </label>

    </div>
     
    <div className="checkout">
     <button 
     className="btn-checkout"
     disabled={!metodoPago}
     >Checkout</button>

     </div>
     <NavbarCliente paginaActiva="carrito" onNavigate={onNavigate} />
    </main> 
    ); 
}