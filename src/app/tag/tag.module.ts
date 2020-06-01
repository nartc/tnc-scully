import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllBlogsBtnModule } from '../shared/components/all-blogs-btn/all-blogs-btn.module';
import { BlogListModule } from '../shared/components/blog-list/blog-list.module';
import { tagRoutes } from './tag-routes';
import { TagComponent } from './tag.component';

@NgModule({
  declarations: [TagComponent],
  imports: [CommonModule, RouterModule.forChild(tagRoutes), BlogListModule, AllBlogsBtnModule],
})
export class TagModule {}
