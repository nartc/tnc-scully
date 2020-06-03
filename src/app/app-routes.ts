import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule) },
  // { path: 'tag', loadChildren: () => import('./tag/tag.module').then((m) => m.TagModule) },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
