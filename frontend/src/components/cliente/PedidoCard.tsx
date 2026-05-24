import { useState } from "react";

import "../../styles/cliente/pedido-card.css";

import type { EstadoPedido } from "../../types/pedido";

type Props = {
  id: number;
  fecha: string;
  total: number;
  estado: EstadoPedido;
  tipoEntrega: "ENVIO" | "RECOJO";
};

export function PedidoCard({
  id,
  fecha,
  total,
  estado,
  tipoEntrega,
}: Props) {

  const [abierto, setAbierto] =
    useState(false);

  function obtenerTextoEstado() {

    switch (estado) {

      case "PENDIENTE":
        return "Pendiente";

      case "EN_PREPARACION":
        return "En preparación";

      case "EN_CAMINO":
        return "En camino";

      case "LISTO_RECOJO":
        return "Listo para recojo";

      case "ENTREGADO":
        return "Entregado";

      case "CANCELADO":
        return "Cancelado";

      default:
        return estado;
    }
  }

  return (

    <article className="pedido-card-contenedor">

      {/* CABECERA */}

      <div
        className="pedido-card-header"
        onClick={() => setAbierto(!abierto)}
      >

        <div>

          <strong>
            Pedido #{id}
          </strong>

          <p className="pedido-fecha">
            {fecha}
          </p>

        </div>

        <span className="pedido-estado">

          {obtenerTextoEstado()}

          {abierto ? " ▲" : " ▼"}

        </span>

      </div>

      {/* DETALLES */}

      {
        abierto && (

          <div className="pedido-detalle">

            {/* TIPO ENTREGA */}

            <p className="pedido-tipo">

              {
                tipoEntrega === "ENVIO"
                  ? "🚚 Envío a domicilio"
                  : "📍 Recojo en tienda"
              }

            </p>

            {/* PRODUCTOS */}

            <div className="pedido-productos">

              <div className="producto-mini">

                <span>
                  2x Coca Cola
                </span>

                <strong>
                  30 Bs.
                </strong>

              </div>

              <div className="producto-mini">

                <span>
                  1x Pringles
                </span>

                <strong>
                  18 Bs.
                </strong>

              </div>

            </div>

            {/* TOTAL */}

            <div className="pedido-total">

              <strong>
                Total: Bs. {total}
              </strong>

            </div>

            {/* STEPPER */}

            <div className="pedido-stepper">

              <div
                className={`step ${
                  estado === "PENDIENTE"
                  || estado === "EN_PREPARACION"
                  || estado === "EN_CAMINO"
                  || estado === "ENTREGADO"
                    ? "activo"
                    : ""
                }`}
              >
                Pendiente
              </div>

              <div
                className={`step ${
                  estado === "EN_PREPARACION"
                  || estado === "EN_CAMINO"
                  || estado === "ENTREGADO"
                    ? "activo"
                    : ""
                }`}
              >
                Preparación
              </div>

              {
                tipoEntrega === "ENVIO"
                  ? (
                    <>

                      <div
                        className={`step ${
                          estado === "EN_CAMINO"
                          || estado === "ENTREGADO"
                            ? "activo"
                            : ""
                        }`}
                      >
                        En camino
                      </div>

                      <div
                        className={`step ${
                          estado === "ENTREGADO"
                            ? "activo"
                            : ""
                        }`}
                      >
                        Entregado
                      </div>

                    </>
                  )

                  : (

                    <div
                      className={`step ${
                        estado === "LISTO_RECOJO"
                        || estado === "ENTREGADO"
                          ? "activo"
                          : ""
                      }`}
                    >
                      Listo recojo
                    </div>

                  )
              }

            </div>

            {/* BOTÓN */}

            {
              estado !== "ENTREGADO"
              && estado !== "CANCELADO"
              && (

                <button
                  className="btn-cancelar"
                >
                  Cancelar Pedido
                </button>

              )
            }

          </div>

        )
      }

    </article>
  );
}