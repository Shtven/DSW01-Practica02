export interface Empleado {
  clave: string;
  nombre: string;
  correo: string;
  direccion: string;
  telefono: string;
  departamentoClave: string;
}

export interface EmpleadoPage {
  content: Empleado[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface EmpleadoFormValue {
  nombre: string;
  contrasena: string;
  correo: string;
  direccion: string;
  telefono: string;
  departamentoClave: string;
}
