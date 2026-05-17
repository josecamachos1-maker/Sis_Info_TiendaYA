import type { RolUsuario } from "../App";

type Props = {
  onSeleccionarRol: (rol: RolUsuario) => void;
};

export function RoleSelectionPage({ onSeleccionarRol }: Props) {
  return (
    <main className="role-page">
      <section className="role-background">
        <button
          className="role-hotspot hotspot-cliente"
          onClick={() => onSeleccionarRol("CLIENTE")}
          aria-label="Ingresar como Cliente"
        />

        <button
          className="role-hotspot hotspot-cajero"
          onClick={() => onSeleccionarRol("CAJERO")}
          aria-label="Ingresar como Cajero"
        />

        <button
          className="role-hotspot hotspot-delivery"
          onClick={() => onSeleccionarRol("REPARTIDOR")}
          aria-label="Ingresar como Delivery"
        />

        <button
          className="role-hotspot hotspot-admin"
          onClick={() => onSeleccionarRol("ADMINISTRADOR")}
          aria-label="Ingresar como Administrador"
        />
      </section>
    </main>
  );
}