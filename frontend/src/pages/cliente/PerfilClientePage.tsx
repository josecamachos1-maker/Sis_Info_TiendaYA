import "../../styles/cliente/perfil-cliente.css";

import { useState, useEffect } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import {
  MapPin,
  Pencil,
  LogOut,
  BadgeCheck,
  UserRound,
  Check,
} from "lucide-react";

type Props = {
  onNavigate: (pagina: string) => void;
  onLogout: () => void;
};

export function PerfilClientePage({ onNavigate, onLogout }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mostrarLogout, setMostrarLogout] = useState(false);


  const [editando, setEditando] = useState(false);

  useEffect(() => {
  async function cargarPerfil() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/clientes/perfil/1"
      );

      if (!response.ok) {
        throw new Error("Error al cargar perfil");
      }

      const data = await response.json();

      setNombre(data.nombre);
      setTelefono(data.telefono);
      setDireccion(data.direccion ?? "");
    } catch (error) {
      console.error(error);
    }
  }

  cargarPerfil();
  }, []);

  async function guardarCambios() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/clientes/perfil/1",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          telefono,
          direccion,
        }),
      }
    )
    console.log(response.status);

    if (!response.ok) {
      throw new Error();
    }

    setEditando(false);

    alert("Información actualizada");
  } catch (error) {
    console.error(error);
    alert("Error al actualizar");
  }
}

return (
  <main className="perfil-cliente-page">
    <header className="cliente-header">
      <Logo width="260px" />
    </header>

    <PaginaActualC titulo="Perfil" />

    {/* AVATAR */}
    <section className="perfil-avatar-seccion">
      <div className="avatar-contenedor">
        <div className="avatar-circulo">
          <UserRound size={50} />
        </div>
        <div className="avatar-check">
          <BadgeCheck size={18} />
        </div>
      </div>

      <h1 className="perfil-nombre-usuario">
        {nombre}
      </h1>
    </section>

    <h3 className="perfil-seccion-titulo">Información Personal</h3>

    {/* BLOQUE: NOMBRE */}
    <div className="info-bloque">
      <div className="info-bloque-texto">
        <span className="info-label">Nombre</span>
        {editando ? (
          <input
            type="text"
            className="perfil-input-edicion"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        ) : (
          <span className="info-valor">{nombre}</span>
        )}
      </div>
      
      {!editando && (
        <button className="btn-editar-lapiz" onClick={() => setEditando(true)}>
          <Pencil size={18}/>
        </button>
      )}
    </div>
    
    {/* BLOQUE: TELÉFONO */}
    <div className="info-bloque">
      <div className="info-bloque-texto">
        <span className="info-label">Teléfono</span>
        {editando ? (
          <input
            type="text"
            className="perfil-input-edicion"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        ) : (
          <span className="info-valor">{telefono}</span>
        )}
      </div>
    
      {!editando && (
        <button className="btn-editar-lapiz" onClick={() => setEditando(true)}>
          <Pencil size={18}/>
        </button>
      )}
    </div>
    
    {/* BLOQUE: DIRECCIÓN */}
    <div className="info-bloque">
      <div className="info-bloque-texto">
        <span className="info-label info-label-mappin">
          <MapPin size={14} /> Dirección
        </span>
        {editando ? (
          <input
            type="text"
            className="perfil-input-edicion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        ) : (
          <span className="info-valor">{direccion || "No especificada"}</span>
        )}
      </div>
    
      {!editando && (
        <button className="btn-editar-lapiz" onClick={() => setEditando(true)}>
          <Pencil size={18}/>
        </button>
      )}
    </div>

    {/* SECCIÓN ACCIONES: GUARDAR CAMBIOS (Aparece abajo centrado y estilizado) */}
    {editando && (
      <div className="perfil-acciones-contenedor">
        <button className="btn-guardar-cambios-nuevo" onClick={guardarCambios}>
          <Check size={18}/>
          <span>Guardar cambios</span>
        </button>
      </div>
    )}  

    {/* BOTÓN CERRAR SESIÓN */}
    <footer className="perfil-footer-acciones">
      <button className="btn-logout" onClick={() => setMostrarLogout(true)}>
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </footer>

    {/* MODAL DE CONFIRMACIÓN */}
    {mostrarLogout && (
      <div className="modal-overlay">
        <div className="modal-confirmacion">
          <h3>¿Cerrar sesión?</h3>
          <p>Tendrás que volver a iniciar sesión para acceder a tu cuenta.</p>
          <div className="modal-botones">
            <button className="btn-modal-cancelar" onClick={() => setMostrarLogout(false)}>
              Cancelar
            </button>
            <button className="btn-modal-confirmar" onClick={onLogout}>
              Sí, cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )}
    
    <NavbarCliente paginaActiva="perfil" onNavigate={onNavigate} />
  </main>
);
}