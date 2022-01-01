import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  NgModule,
} from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggler',
  template: `
    <div class="w-full h-full text-2xl">
      <span *ngIf="(currentScheme$ | async) === 'dark'; else light">🌜</span>
      <ng-template #light>
        <span>🌞</span>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTogglerComponent {
  @Input() positionClass: string;

  // For disabling Angular
  // @HostBinding('id') togglerId = 'themeToggler';

  @HostBinding('class') get themeTogglerClasses() {
    return (
      'w-10 h-10 lg:flex lg:items-center lg:justify-center cursor-pointer' +
      ' ' +
      this.positionClass
    );
  }

  @HostBinding('attr.aria-label') ariaLabel = 'Dark and Light mode toggle button';

  @HostListener('click')
  onClick() {
    this.themeService.toggle();
  }

  currentScheme$ = this.themeService.currentScheme$;

  constructor(private themeService: ThemeService) {}
}

@NgModule({
  declarations: [ThemeTogglerComponent],
  exports: [ThemeTogglerComponent],
  imports: [CommonModule],
})
export class ThemeTogglerModule {}
