import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BlogListItemComponent } from './components/blog-list-item/blog-list-item.component';
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
    BlogListItemComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(homeRoutes)],
})
export class HomeModule {}
