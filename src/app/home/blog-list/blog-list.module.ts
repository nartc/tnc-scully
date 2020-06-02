import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListItemModule } from '../../shared/components/blog-list-item/blog-list-item.module';
import { BlogListComponent } from './blog-list.component';

const blogListRoutes: Routes = [{ path: '', component: BlogListComponent }];

@NgModule({
  declarations: [BlogListComponent],
  imports: [CommonModule, RouterModule.forChild(blogListRoutes), BlogListItemModule],
})
export class BlogListModule {}
