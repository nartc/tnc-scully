import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { defer, EMPTY, from, Observable, of } from 'rxjs';
import { mapTo, startWith, switchMap, tap } from 'rxjs/operators';
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
  blog$: Observable<Frontmatter> = of(this.isProd).pipe(
    switchMap((isProd) => {
      return defer(() => {
        if (isProd && this.swUpdate.isEnabled) {
          return from(this.swUpdate.checkForUpdate()).pipe(
            switchMap(() => this.swUpdate.available.pipe(mapTo(true), startWith(false))),
            switchMap((hasUpdate) => {
              if (hasUpdate) {
                this.swUpdate.checkForUpdate().then(() => window?.location?.reload());
                return EMPTY;
              }
              return this.scullyRoutesService.getCurrent();
            }),
          );
        }

        return this.scullyRoutesService.getCurrent();
      }).pipe(
        tap((blog: Frontmatter) => {
          this.metaService.update({ ...blog, url: `${environment.baseUrl}${blog.route}` });
        }),
      );
    }),
  );

  constructor(
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
    private readonly swUpdate: SwUpdate,
  ) {}
}
