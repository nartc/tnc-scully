import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule) },
  { path: 'tag', loadChildren: () => import('./tag/tag.module').then((m) => m.TagModule) },
];
