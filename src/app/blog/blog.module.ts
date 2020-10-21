import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { AllBlogsBtnModule } from '../shared/components/all-blogs-btn/all-blogs-btn.module';
import { ThemeTogglerModule } from '../shared/components/theme-toggler/theme-toggler.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { UtterancesDirective } from './directives/utterances.directive';

@NgModule({
  declarations: [BlogComponent, UtterancesDirective],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ScullyLibModule,
    AllBlogsBtnModule,
    ThemeTogglerModule,
  ],
})
export class BlogModule {}
