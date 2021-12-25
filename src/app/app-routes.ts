import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

export const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./home/home.component').then((m) => m.HomeModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.component').then((m) => m.BlogModule) },
  { path: 'tag', loadChildren: () => import('./tag.component').then((m) => m.TagModule) },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
