import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import {
  catchError,
  combineLatest,
  defer,
  from,
  map,
  mapTo,
  Observable,
  of,
  OperatorFunction,
  pairwise,
  pipe,
  startWith,
  switchMapTo,
  tap,
  timeout,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { Frontmatter } from '../shared/frontmatter';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  isProd = environment.production;

  private readonly isUpdateAvailable = (): OperatorFunction<UpdateAvailableEvent, boolean[]> => {
    return pipe(
      timeout(5000),
      mapTo(true),
      startWith(false),
      pairwise(),
      catchError(() => of([false, false])),
    );
  };

  blog$: Observable<{ loading: boolean; content: Frontmatter }> = defer(() => {
    if (this.isProd && this.swUpdate.isEnabled) {
      // noinspection JSDeprecatedSymbols
      return combineLatest({
        content: this.scullyRoutesService.getCurrent(),
        loading: from(this.swUpdate.checkForUpdate()).pipe(
          switchMapTo(
            this.swUpdate.available.pipe(
              this.isUpdateAvailable(),
              map(([_, hasUpdate]) => {
                if (hasUpdate) {
                  this.swUpdate
                    .activateUpdate()
                    .then(() => this.document.defaultView?.location?.reload());
                }
                return false;
              }),
            ),
          ),
          startWith(true),
        ),
      });
    }

    return this.scullyRoutesService
      .getCurrent()
      .pipe(map((content) => ({ loading: false, content })));
  }).pipe(
    tap(({ content }) => {
      this.metaService.update({ ...content, url: `${environment.baseUrl}${content.route}` });
    }),
  );

  constructor(
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
    private readonly swUpdate: SwUpdate,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}
}
