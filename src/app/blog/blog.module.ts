import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ScullyLibModule} from '@scullyio/ng-lib';
import { AllBlogsBtnModule } from '../shared/components/all-blogs-btn/all-blogs-btn.module';
import { ThemeTogglerModule } from '../shared/components/theme-toggler/theme-toggler.module';
import {BlogRoutingModule} from './blog-routing.module';
import {BlogComponent} from './blog.component';

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, BlogRoutingModule, ScullyLibModule, AllBlogsBtnModule, ThemeTogglerModule],
})
export class BlogModule {}
