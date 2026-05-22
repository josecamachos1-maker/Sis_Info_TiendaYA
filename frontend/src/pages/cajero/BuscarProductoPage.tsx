import { useState, useRef } from "react";
import "../../styles//buscar-producto.css";
import "../../styles/dashboard-cajero.css";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  Settings,
  Package,
  ChevronRight,
  LogOut,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
 
// ─── Tipos ────────────────────────────────────────────────────────────────────
 
export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  proveedor: string;
  fechaActualizacion: string;
};
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
 
function obtenerStockInfo(stock: number): { clase: string; etiqueta: string } {
  if (stock === 0) return { clase: "stock-out", etiqueta: "Sin stock" };
  if (stock <= 5) return { clase: "stock-low", etiqueta: `Stock bajo (${stock})` };
  return { clase: "stock-ok", etiqueta: `${stock} en stock` };
}
 
const CATEGORIAS = ["Todos", "Bebidas", "Snacks", "Lácteos", "Limpieza", "Panadería"];
 
// ─── Datos de ejemplo (reemplazar con llamada a API) ─────────────────────────
 
const PRODUCTOS_EJEMPLO: Producto[] = [
  { id: "P001", nombre: "Coca-Cola 2L", categoria: "Bebidas", precio: 15, stock: 42, unidad: "Botella", proveedor: "EMBOL", fechaActualizacion: "20/5/2026" },
  { id: "P002", nombre: "Agua mineral 500ml", categoria: "Bebidas", precio: 5, stock: 120, unidad: "Botella", proveedor: "Vital", fechaActualizacion: "20/5/2026" },
  { id: "P003", nombre: "Jugos Del Valle 1L", categoria: "Bebidas", precio: 12, stock: 3, unidad: "Caja", proveedor: "Del Valle", fechaActualizacion: "19/5/2026" },
  { id: "P004", nombre: "Papas fritas Lay's 100g", categoria: "Snacks", precio: 9, stock: 55, unidad: "Bolsa", proveedor: "Pepsico", fechaActualizacion: "18/5/2026" },
  { id: "P005", nombre: "Galletas Oreo 120g", categoria: "Snacks", precio: 8, stock: 0, unidad: "Paquete", proveedor: "Nabisco", fechaActualizacion: "17/5/2026" },
  { id: "P006", nombre: "Chocolates Milky Way", categoria: "Snacks", precio: 6, stock: 28, unidad: "Unidad", proveedor: "Mars", fechaActualizacion: "20/5/2026" },
  { id: "P007", nombre: "Leche PIL 1L", categoria: "Lácteos", precio: 11, stock: 18, unidad: "Bolsa", proveedor: "PIL Andina", fechaActualizacion: "21/5/2026" },
  { id: "P008", nombre: "Yogurt frutado 200g", categoria: "Lácteos", precio: 7, stock: 2, unidad: "Vaso", proveedor: "PIL Andina", fechaActualizacion: "21/5/2026" },
  { id: "P009", nombre: "Jabón Omo 500g", categoria: "Limpieza", precio: 22, stock: 14, unidad: "Bolsa", proveedor: "Unilever", fechaActualizacion: "15/5/2026" },
  { id: "P010", nombre: "Detergente Ariel 1kg", categoria: "Limpieza", precio: 35, stock: 0, unidad: "Bolsa", proveedor: "P&G", fechaActualizacion: "12/5/2026" },
  { id: "P011", nombre: "Pan de molde grande", categoria: "Panadería", precio: 18, stock: 7, unidad: "Bolsa", proveedor: "Bimbo", fechaActualizacion: "21/5/2026" },
  { id: "P012", nombre: "Marraqueta docena", categoria: "Panadería", precio: 10, stock: 30, unidad: "Docena", proveedor: "Local", fechaActualizacion: "21/5/2026" },
];
 
// ─── Componente principal ────────────────────────────────────────────────────
 
export function BuscarProductoPage() {
  const productos = PRODUCTOS_EJEMPLO; // reemplazar con: await obtenerProductos()
 
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [soloConStock, setSoloConStock] = useState(false);
  const [orden, setOrden] = useState<"nombre" | "precio_asc" | "precio_desc" | "stock">("nombre");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
 
  const inputRef = useRef<HTMLInputElement>(null);
 
  // ── Filtrado y ordenamiento ─────────────────────────────────────────────────
  const productosFiltrados = productos
    .filter((p) => {
      const q = busqueda.toLowerCase();
      const matchBusqueda =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q);
      const matchCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
      const matchStock = !soloConStock || p.stock > 0;
      return matchBusqueda && matchCategoria && matchStock;
    })
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "precio_asc") return a.precio - b.precio;
      if (orden === "precio_desc") return b.precio - a.precio;
      if (orden === "stock") return b.stock - a.stock;
      return 0;
    });
 
  function limpiarFiltros() {
    setBusqueda("");
    setCategoriaActiva("Todos");
    setSoloConStock(false);
    setOrden("nombre");
    inputRef.current?.focus();
  }
 
  return (
    <main className="cajero-dashboard">
      {/* ── Sidebar ── */}
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>
        <nav className="cajero-menu">
          <button className="menu-item">
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </button>
          <button className="menu-item">
            <ShoppingCart size={22} />
            <span>Nueva Venta</span>
          </button>
          <button className="menu-item">
            <ClipboardList size={22} />
            <span>Registrar Pedido</span>
          </button>
          <button className="menu-item active">
            <Search size={22} />
            <span>Buscar Producto</span>
          </button>
          <button className="menu-item">
            <PackageCheck size={22} />
            <span>Pedidos Pendientes</span>
          </button>
          <button className="menu-item">
            <Users size={22} />
            <span>Clientes</span>
          </button>
          <button className="menu-item">
            <WalletCards size={22} />
            <span>Cierre de Caja</span>
          </button>
          <button className="menu-item">
            <BarChart3 size={22} />
            <span>Reportes</span>
          </button>
          <button className="menu-item">
            <Settings size={22} />
            <span>Configuración</span>
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-icon">
            <Users size={22} />
          </div>
          <div>
            <strong>Lindsay</strong>
            <p>Turno: Mañana</p>
          </div>
          <LogOut size={18} />
        </div>
      </aside>
 
      {/* ── Contenido ── */}
      <section className="cajero-content">
        {/* Header */}
        <header className="bp-header">
          <div>
            <h1>Buscar producto</h1>
            <p>Consulta precios, stock y detalles de cualquier producto.</p>
          </div>
        </header>
 
        {/* Barra de búsqueda */}
        <div className="bp-search-bar">
          <div className="bp-input-wrap">
            <Search size={20} className="bp-input-icon" />
            <input
              ref={inputRef}
              className="bp-input"
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="bp-input-clear" onClick={() => setBusqueda("")}>
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className={`bp-filter-btn ${soloConStock ? "active" : ""}`}
            onClick={() => setSoloConStock((v) => !v)}
          >
            <Filter size={16} /> Solo con stock
          </button>
          <button className="bp-filter-btn" onClick={limpiarFiltros}>
            <RefreshCw size={16} /> Limpiar
          </button>
        </div>
 
        {/* Filtros por categoría */}
        <div className="bp-categorias">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`bp-cat-btn ${categoriaActiva === cat ? "active" : ""}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        {/* Grid + panel de detalle */}
        <div className="bp-main-layout">
          <div>
            <div className="bp-results-header">
              <span className="bp-results-count">
                Mostrando {productosFiltrados.length} producto
                {productosFiltrados.length !== 1 ? "s" : ""}
              </span>
              <select
                className="bp-sort-select"
                value={orden}
                onChange={(e) => setOrden(e.target.value as typeof orden)}
              >
                <option value="nombre">Ordenar: A-Z</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="stock">Mayor stock</option>
              </select>
            </div>
 
            {productosFiltrados.length === 0 ? (
              <div className="bp-empty">
                <Package size={48} />
                <p>No se encontraron productos.</p>
                <button className="bp-filter-btn" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="bp-grid">
                {productosFiltrados.map((producto) => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    seleccionado={productoSeleccionado?.id === producto.id}
                    onSeleccionar={() =>
                      setProductoSeleccionado((prev) =>
                        prev?.id === producto.id ? null : producto
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
 
          {productoSeleccionado && (
            <DetalleProducto
              producto={productoSeleccionado}
              onCerrar={() => setProductoSeleccionado(null)}
            />
          )}
        </div>
      </section>
    </main>
  );
}
 
// ─── Subcomponente: Tarjeta de producto ───────────────────────────────────────
 
function ProductoCard({
  producto,
  seleccionado,
  onSeleccionar,
}: {
  producto: Producto;
  seleccionado: boolean;
  onSeleccionar: () => void;
}) {
  const { clase, etiqueta } = obtenerStockInfo(producto.stock);
 
  return (
    <article
      className={`bp-producto-card ${seleccionado ? "seleccionado" : ""}`}
      onClick={onSeleccionar}
    >
      <div className="bp-prod-img">
        <Package size={28} />
      </div>
      <div className="bp-prod-categoria">{producto.categoria}</div>
      <div className="bp-prod-nombre">{producto.nombre}</div>
      <div className="bp-prod-precio">{formatearBolivianos(producto.precio)}</div>
      <div className="bp-prod-footer">
        <span className={`bp-stock-badge ${clase}`}>{etiqueta}</span>
        <button
          className="bp-btn-agregar"
          disabled={producto.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            alert(`✓ "${producto.nombre}" agregado a la venta.`);
          }}
        >
          + Venta
        </button>
      </div>
    </article>
  );
}
 
// ─── Subcomponente: Panel de detalle ──────────────────────────────────────────
 
function DetalleProducto({
  producto,
  onCerrar,
}: {
  producto: Producto;
  onCerrar: () => void;
}) {
  const { clase, etiqueta } = obtenerStockInfo(producto.stock);
 
  return (
    <aside className="bp-detalle-panel">
      <button className="bp-detalle-cerrar" onClick={onCerrar}>
        <X size={18} />
      </button>
 
      <div className="bp-detalle-img">
        <Package size={48} />
      </div>
 
      <div className="bp-detalle-cat">{producto.categoria}</div>
      <div className="bp-detalle-nombre">{producto.nombre}</div>
      <div className="bp-detalle-precio">{formatearBolivianos(producto.precio)}</div>
 
      <div className="bp-detalle-filas">
        <div className="bp-detalle-fila">
          <span>Código</span>
          <span>{producto.id}</span>
        </div>
        <div className="bp-detalle-fila">
          <span>Stock</span>
          <span className={`bp-stock-badge ${clase}`}>{etiqueta}</span>
        </div>
        <div className="bp-detalle-fila">
          <span>Unidad</span>
          <span>{producto.unidad}</span>
        </div>
        <div className="bp-detalle-fila">
          <span>Proveedor</span>
          <span>{producto.proveedor}</span>
        </div>
        <div className="bp-detalle-fila" style={{ border: "none" }}>
          <span>Última actualización</span>
          <span>{producto.fechaActualizacion}</span>
        </div>
      </div>
 
      <button
        className="bp-btn-venta"
        disabled={producto.stock === 0}
        onClick={() => alert(`✓ "${producto.nombre}" agregado a la venta.`)}
      >
        + Agregar a venta
      </button>
 
      <button className="bp-btn-ver-pedidos ver-todo">
        Ver pedidos con este producto <ChevronRight size={16} />
      </button>
    </aside>
  );
}