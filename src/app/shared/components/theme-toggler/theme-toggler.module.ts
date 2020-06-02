import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeTogglerComponent } from './theme-toggler.component';



@NgModule({
  declarations: [ThemeTogglerComponent],
  exports: [
    ThemeTogglerComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class ThemeTogglerModule { }
