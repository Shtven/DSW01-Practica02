import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginPageComponent } from './auth/login-page.component';
import { EmpleadosListPageComponent } from './empleados/empleados-list-page.component';
import { EmpleadoEditPageComponent } from './empleados/empleado-edit-page.component';
import { DepartamentosListPageComponent } from './departamentos/departamentos-list-page.component';
import { DepartamentoEditPageComponent } from './departamentos/departamento-edit-page.component';

export const routes: Routes = [
	{ path: 'login', component: LoginPageComponent },
	{ path: 'empleados', canActivate: [authGuard], component: EmpleadosListPageComponent },
	{ path: 'empleados/nuevo', canActivate: [authGuard], component: EmpleadoEditPageComponent },
	{ path: 'empleados/:clave/editar', canActivate: [authGuard], component: EmpleadoEditPageComponent },
	{ path: 'departamentos', canActivate: [authGuard], component: DepartamentosListPageComponent },
	{ path: 'departamentos/nuevo', canActivate: [authGuard], component: DepartamentoEditPageComponent },
	{ path: 'departamentos/:clave/editar', canActivate: [authGuard], component: DepartamentoEditPageComponent },
	{ path: '', pathMatch: 'full', redirectTo: 'empleados' },
	{ path: '**', redirectTo: 'empleados' }
];
