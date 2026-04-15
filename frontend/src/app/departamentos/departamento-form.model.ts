import { Validators } from '@angular/forms';

export const DEPARTAMENTO_FORM_VALIDATORS = {
  nombre: [Validators.required, Validators.maxLength(100)]
};
