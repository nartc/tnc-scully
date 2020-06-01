import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogListComponent } from './blog-list.component';

@NgModule({
  declarations: [BlogListComponent],
  imports: [CommonModule, RouterModule],
  exports: [BlogListComponent],
})
export class BlogListModule {}
