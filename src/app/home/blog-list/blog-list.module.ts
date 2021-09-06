import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { BlogListItemModule } from '../../shared/components/blog-list-item/blog-list-item.module';
import { BlogListComponent } from './blog-list.component';
// import { IntersectionObserverModule } from '../../shared/directives/intersection-observer/intersection-observer.module';

const blogListRoutes: Routes = [{ path: '', component: BlogListComponent }];

@NgModule({
  declarations: [BlogListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(blogListRoutes),
    BlogListItemModule,
    IntersectionObserverModule,
    // IntersectionObserverModule,
  ],
})
export class BlogListModule {}
