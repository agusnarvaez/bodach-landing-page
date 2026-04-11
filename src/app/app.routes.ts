import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Bodach — Herrajes y Fijaciones Industriales',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent),
    title: 'Catálogo de Productos — Bodach',
  },
  {
    path: 'catalogo/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contacto — Bodach',
  },
  {
    path: 'notFound',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página no encontrada — Bodach',
  },
  { path: '**', redirectTo: 'notFound' },
]