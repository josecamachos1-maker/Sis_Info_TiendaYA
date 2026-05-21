import "../../styles/cliente/categoria.css";

export function CategoriaTabs() {
  const categorias = [
    "Todas",
    "Bebidas",
    "Cereales",
    "Snacks",
    "Lácteos",
  ];

  return (
    <section className="categorias">
      {categorias.map((categoria) => (
        <button key={categoria}>{categoria}</button>
      ))}
    </section>
  );
}