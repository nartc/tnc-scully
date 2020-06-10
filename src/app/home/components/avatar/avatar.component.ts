import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first, mapTo, startWith, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../../shared/destroyable';

@Component({
  selector: 'app-avatar',
  template: `
    <div
      class="w-16 h-16 relative mb-4"
      role="img"
      aria-label="Avatar of blog author"
      *ngIf="hasUpdate$ | async as hasUpdate"
      [ngClass]="{ 'pointer-events-none': !hasUpdate, 'cursor-pointer': hasUpdate }"
      (click)="reload(hasUpdate)"
    >
      <div
        class="group w-full h-full rounded-full border-4 border-transparent text-center flex items-center relative avatar"
        [attr.data-tooltip]="'Some tooltip goes here'"
        [ngClass]="{ show: hasUpdate, tooltip: hasUpdate }"
      >
        <span class="hidden group-hover:table-cell text-white font-bold align-middle">
          KR
        </span>
        <img
          src="https://avatars1.githubusercontent.com/u/25516557?s=460&u=b15a0b6c89d6d8d0b7225a6eab30c060f70d3d9f&v=4"
          alt="avatar"
          class="object-cover object-center rounded-full w-full h-full visible group-hover:hidden"
        />
      </div>
    </div>
  `,
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent extends Destroyable {
  hasUpdate$ = this.swUpdate.available.pipe(startWith(false), mapTo(true));

  constructor(readonly appRef: ApplicationRef, private readonly swUpdate: SwUpdate) {
    super();
    if (swUpdate.isEnabled) {
      const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable === true));
      const everySixHours$ = interval(6 * 60 * 60 * 1000);
      const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
      everySixHoursOnceAppIsStable$
        .pipe(takeUntil(this.$destroyed))
        .subscribe(() => swUpdate.checkForUpdate());
    }
  }

  reload(hasUpdate: boolean) {
    if (!hasUpdate) {
      return;
    }
    window?.location?.reload();
  }
}
