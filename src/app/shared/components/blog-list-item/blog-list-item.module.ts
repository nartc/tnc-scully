import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogListItemComponent } from './blog-list-item.component';

@NgModule({
  declarations: [BlogListItemComponent],
  imports: [CommonModule, RouterModule],
  exports: [BlogListItemComponent],
})
export class BlogListItemModule {}
