import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IntersectionObserveeDirective } from './intersection-observee.directive';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@NgModule({
  declarations: [IntersectionObserverDirective, IntersectionObserveeDirective],
  imports: [CommonModule],
  exports: [IntersectionObserverDirective, IntersectionObserveeDirective],
})
export class IntersectionObserverModule {}
