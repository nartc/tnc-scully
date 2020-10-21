import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllBlogsBtnModule } from '../shared/components/all-blogs-btn/all-blogs-btn.module';
import { BlogListItemModule } from '../shared/components/blog-list-item/blog-list-item.module';
import { ThemeTogglerModule } from '../shared/components/theme-toggler/theme-toggler.module';
import { tagRoutes } from './tag-routes';
import { TagComponent } from './tag.component';

@NgModule({
  declarations: [TagComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(tagRoutes),
    BlogListItemModule,
    AllBlogsBtnModule,
    ThemeTogglerModule,
  ],
})
export class TagModule {}
