import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { combineLatest, defer, from, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MetaService } from '../shared/services/meta.service';
import { Frontmatter } from '../shared/frontmatter';
import {
  catchError,
  map,
  mapTo,
  pairwise,
  startWith,
  switchMapTo,
  tap,
  timeout,
} from 'rxjs/operators';

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
  blog$: Observable<{ loading: boolean; content: Frontmatter }> = defer(() => {
    if (this.isProd && this.swUpdate.isEnabled) {
      return combineLatest([
        this.scullyRoutesService.getCurrent(),
        from(this.swUpdate.checkForUpdate()).pipe(
          switchMapTo(
            this.swUpdate.available.pipe(
              timeout(5000), // timeout 5s
              mapTo(true),
              startWith(false),
              pairwise(),
              catchError(() => of([false, false])),
              map(([_, hasUpdate]) => {
                if (hasUpdate) {
                  this.swUpdate.activateUpdate().then(() => window?.location?.reload());
                }
                return false;
              }),
            ),
          ),
          startWith(true),
        ),
      ]).pipe(map(([content, loading]) => ({ loading, content })));
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
  ) {}
}
