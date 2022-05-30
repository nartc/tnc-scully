import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, map } from 'rxjs';
import { first, startWith, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Destroyable } from '../../../shared/destroyable';

@Component({
  selector: 'app-avatar',
  template: `
    <div
      class="w-16 h-16 relative mb-4"
      [class.pointer-events-none]="!vm.hasUpdate"
      [class.cursor-pointer]="vm.hasUpdate"
      role="img"
      aria-label="Avatar of the blog author"
      *ngIf="{ hasUpdate: hasUpdate$ | async } as vm"
      (click)="reload(vm.hasUpdate)"
    >
      <div
        class="group w-full h-full rounded-full border-4 border-transparent text-center flex items-center relative avatar"
        [class.show]="vm.hasUpdate"
        [class.cursor-pointer]="vm.hasUpdate"
        [attr.data-tooltip]="'New version available 🚀'"
      >
        <img
          [src]="avatar"
          alt="avatar"
          class="object-cover object-center rounded-full w-full h-full visible group-hover:hidden"
          width="64"
          height="64"
        />
      </div>
    </div>
  `,
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent extends Destroyable {
  readonly avatar = environment.avatar;
  readonly hasUpdate$ = this.swUpdate.versionUpdates.pipe(
    map(() => true),
    startWith(false),
  );

  constructor(
    appRef: ApplicationRef,
    private swUpdate: SwUpdate,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super();
    if (swUpdate.isEnabled) {
      const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable === true));
      const everyFiveMinutes$ = interval(5 * 60 * 1000); // every 5 minutes
      const everyFiveMinutesOnceAppIsStable$ = concat(appIsStable$, everyFiveMinutes$);
      everyFiveMinutesOnceAppIsStable$
        .pipe(takeUntil(this.$destroyed))
        .subscribe(() => swUpdate.checkForUpdate());
    }
  }

  reload(hasUpdate: boolean) {
    if (!hasUpdate) {
      return;
    }
    this.document.defaultView?.location?.reload();
  }
}
