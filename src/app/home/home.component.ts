import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeTogglerModule } from '../shared/components/theme-toggler.component';
import { MetaService } from '../shared/services/meta.service';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CopyrightComponent } from './components/copyright.component';
import { InfoComponent } from './components/info.component';
import { NavigationComponent } from './components/navigation.component';
import { SocialIconComponent } from './components/social-icon.component';
import { SocialsComponent } from './components/socials.component';

@Component({
  selector: 'app-home',
  template: `
    <div class="grid gap-x-4 grid-cols-1 lg:grid-cols-4">
      <aside class="col-span-4 lg:col-span-1">
        <div class="max-w-full lg:max-w-sm rounded overflow-hidden shadow-common p-4 relative">
          <app-theme-toggler positionClass="absolute top-1 right-1"></app-theme-toggler>
          <app-avatar></app-avatar>
          <app-info></app-info>
          <app-navigation></app-navigation>
          <app-socials></app-socials>
          <app-copyright></app-copyright>
        </div>
      </aside>
      <main class="col-span-4 lg:col-span-3">
        <div class="rounded overflow-hidden shadow-common p-4 lg:overflow-auto lg:max-h-228">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(metaService: MetaService) {
    metaService.resetMeta();
  }
}

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./blog-list.component').then((m) => m.BlogListModule),
      },
      {
        path: 'about',
        loadChildren: () => import('./about.component').then((m) => m.AboutModule),
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    SocialIconComponent,
    AvatarComponent,
    InfoComponent,
    NavigationComponent,
    SocialsComponent,
    CopyrightComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(homeRoutes), ThemeTogglerModule],
})
export class HomeModule {}
