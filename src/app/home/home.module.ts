import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeTogglerModule } from '../shared/components/theme-toggler/theme-toggler.module';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { InfoComponent } from './components/info/info.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SocialIconComponent } from './components/social-icon/social-icon.component';
import { SocialsComponent } from './components/socials/socials.component';
import { homeRoutes } from './home-routes';

import { HomeComponent } from './home.component';

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
