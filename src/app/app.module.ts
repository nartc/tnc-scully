import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', loadChildren: () => import('./home/home.component').then((m) => m.HomeModule) },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.component').then((m) => m.BlogModule),
      },
      { path: 'tag', loadChildren: () => import('./tag.component').then((m) => m.TagModule) },
      { path: '404', component: NotFoundComponent },
      { path: '**', component: NotFoundComponent },
    ]),
    ScullyLibModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
