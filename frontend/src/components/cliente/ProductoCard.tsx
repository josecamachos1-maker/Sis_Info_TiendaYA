import "../../styles/cliente/producto-card.css";
type Props = {
  nombre: string;
  precio: number;
  imagen: string;

  disponible?: boolean;

  cantidad?: number;

  mostrarDisponibilidad?: boolean;
};

export function ProductoCard({
  nombre,
  precio,
  imagen,
  disponible,
  cantidad = 0,
  mostrarDisponibilidad = false,
}: Props) {
  return (
    <article className="producto-card">

      <img
        src={imagen}
        alt={nombre}
        className="producto-imagen"
      />

      <h3>{nombre}</h3>

      <p className="precio">
        Bs. {precio}
      </p>

      {
        mostrarDisponibilidad && (
          <p className={disponible ? "disponible" : "nodisponible"}>
            {disponible ? "Disponible" : "No disponible"}
          </p>
        )
      }

      {
        cantidad > 0 ? (

          <div className="contador">

            <button>-</button>

            <span>{cantidad}</span>

            <button>+</button>

          </div>

        ) : (

          <button className="btn-anadir">
            Añadir
          </button>

        )
      }

    </article>
  );
}