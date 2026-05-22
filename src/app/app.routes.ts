import { Routes } from '@angular/router';
import { App } from './app';
import { Detalle } from './pages/detalle/detalle';

export const routes: Routes = [
  { path: '', component: App },
  { path: 'detalle/:id', component: Detalle },
];