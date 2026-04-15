import { Validators } from '@angular/forms';

export const EMPLEADO_FORM_VALIDATORS = {
  nombre: [Validators.required, Validators.maxLength(100)],
  contrasena: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
  correo: [Validators.required, Validators.email, Validators.maxLength(254)],
  direccion: [Validators.required, Validators.maxLength(100)],
  telefono: [Validators.required, Validators.maxLength(100)],
  departamentoClave: [Validators.required, Validators.maxLength(32)]
};
