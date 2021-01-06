import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./blog-list/blog-list.module').then((m) => m.BlogListModule),
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then((m) => m.AboutModule),
      }
    ],
  },
];
