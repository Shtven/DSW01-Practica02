export interface Departamento {
  clave: string;
  nombre: string;
  empleados: string[];
}

export interface DepartamentoPage {
  content: Departamento[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DepartamentoFormValue {
  nombre: string;
}
