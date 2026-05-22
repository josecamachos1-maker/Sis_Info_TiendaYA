const API_URL = "http://localhost:3000";

export type RolBackend = "CLIENTE" | "CAJERO" | "REPARTIDOR" | "DUENO";

export type LoginRequest = {
  email: string;
  password: string;
  rol: RolBackend;
};

export type LoginResponse = {
  id: number;
  nombre: string;
  email: string;
  rol: RolBackend;
};

export async function loginUsuario(datos: LoginRequest): Promise<LoginResponse> {
  const respuesta = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al iniciar sesión");
  }

  return contenido;

  
}
export type EstadoPedido =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "LISTO_PARA_ENTREGAR"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO"
  | "ENTREGA_FALLIDA";

export type DashboardResumen = {
  ventasDelDia: number;
  pedidosActivos: number;
  totalEfectivo: number;
  totalQrTransferencia: number;
};

export type DashboardPedido = {
  id: number;
  clienteNombre: string;
  telefono: string;
  estado: EstadoPedido;
  total: number;
  metodoPago: string;
  fechaHora: string;
};

export type DashboardAlerta = {
  tipo: string;
  productoNombre: string;
  detalle: string;
  imageUrl: string;
};

export type DashboardEstadoSistema = {
  online: boolean;
  sincronizado: boolean;
  datosPendientes: number;
};

export type CajeroDashboardResponse = {
  resumen: DashboardResumen;
  pedidosPendientes: DashboardPedido[];
  alertas: DashboardAlerta[];
  estadoSistema: DashboardEstadoSistema;
};

export async function obtenerDashboardCajero(): Promise<CajeroDashboardResponse> {
  const respuesta = await fetch(`${API_URL}/v1/cajero/dashboard`);

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al cargar dashboard");
  }

  return contenido;
}

export type ProductoApi = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  proveedor: string;
  fechaActualizacion: string;
  activo: boolean;
  imageUrl: string;
};

type ProductoBackend = {
  id: number;
  nombre?: string;
  categoria?: string;
  precio?: number;
  precioVenta?: number;
  precioUnitario?: number;
  stock?: number;
  unidad?: string;
  proveedor?: string;
  fechaActualizacion?: string;
  fechaVencimiento?: string;
  createdAt?: string;
  updatedAt?: string;
  activo?: boolean;
  imageUrl?: string;
  image_url?: string;
};

function normalizarProducto(producto: ProductoBackend): ProductoApi {
  const fecha =
    producto.fechaActualizacion ||
    producto.updatedAt ||
    producto.createdAt ||
    producto.fechaVencimiento ||
    "";

  return {
    id: producto.id,
    nombre: producto.nombre || "Producto sin nombre",
    categoria: producto.categoria || "Sin categoría",
    precio: Number(
      producto.precio ??
      producto.precioVenta ??
      producto.precioUnitario ??
      0
    ),
    stock: Number(producto.stock ?? 0),
    unidad: producto.unidad || "Unidad",
    proveedor: producto.proveedor || "No registrado",
    fechaActualizacion: fecha
      ? new Date(fecha).toLocaleDateString("es-BO")
      : "-",
    activo: producto.activo !== false,
    imageUrl: producto.imageUrl || producto.image_url || "",
  };
}

export async function obtenerProductos(): Promise<ProductoApi[]> {
  const respuesta = await fetch(`${API_URL}/v1/productos`);

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al cargar productos");
  }

  const lista = Array.isArray(contenido) ? contenido : [];

  return lista
    .map((producto: ProductoBackend) => normalizarProducto(producto))
    .filter((producto: ProductoApi) => producto.activo);
}