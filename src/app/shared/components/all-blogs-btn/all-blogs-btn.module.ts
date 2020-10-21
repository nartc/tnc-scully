import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AllBlogsBtnComponent } from './all-blogs-btn.component';

@NgModule({
  declarations: [AllBlogsBtnComponent],
  imports: [CommonModule, RouterModule],
  exports: [AllBlogsBtnComponent],
})
export class AllBlogsBtnModule {}
