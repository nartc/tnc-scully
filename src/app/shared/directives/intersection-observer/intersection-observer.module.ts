import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { IntersectionObserveeDirective } from './intersection-observee.directive';

@NgModule({
  declarations: [IntersectionObserverDirective, IntersectionObserveeDirective],
  imports: [CommonModule],
  exports: [IntersectionObserverDirective, IntersectionObserveeDirective],
})
export class IntersectionObserverModule {}
