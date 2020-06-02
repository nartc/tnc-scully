import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';

const aboutRoutes: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, RouterModule.forChild(aboutRoutes)],
})
export class AboutModule {}
