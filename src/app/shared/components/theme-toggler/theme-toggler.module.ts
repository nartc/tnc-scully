import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeTogglerComponent } from './theme-toggler.component';

@NgModule({
  declarations: [ThemeTogglerComponent],
  exports: [ThemeTogglerComponent],
  imports: [CommonModule],
})
export class ThemeTogglerModule {}
