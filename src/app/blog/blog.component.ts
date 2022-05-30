import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { ScullyLibModule, ScullyRoutesService } from '@scullyio/ng-lib';
import {
  catchError,
  combineLatest,
  defer,
  from,
  map,
  Observable,
  of,
  OperatorFunction,
  pairwise,
  pipe,
  startWith,
  switchMap,
  tap,
  timeout,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { AllBlogsBtnModule } from '../shared/components/all-blogs-btn.component';
import { ThemeTogglerModule } from '../shared/components/theme-toggler.component';
import { Frontmatter } from '../shared/frontmatter';
import { MetaService } from '../shared/services/meta.service';
import { GiscusDirective } from './directives/giscus.directive';

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

  private isUpdateAvailable = (): OperatorFunction<VersionReadyEvent, boolean[]> => {
    return pipe(
      timeout(5000),
      map(() => true),
      startWith(false),
      pairwise(),
      catchError(() => of([false, false])),
    );
  };

  blog$: Observable<{ loading: boolean; content: Frontmatter }> = defer(() => {
    if (this.isProd && this.swUpdate.isEnabled) {
      // noinspection JSDeprecatedSymbols
      return combineLatest([
        this.scullyRoutesService.getCurrent(),
        from(this.swUpdate.checkForUpdate()).pipe(
          switchMap(() =>
            this.swUpdate.versionUpdates.pipe(
              this.isUpdateAvailable(),
              map(([_, hasUpdate]) => {
                if (hasUpdate) {
                  this.swUpdate
                    .activateUpdate()
                    .then(() => this.document.defaultView?.location?.reload());
                }
                console.log({ hasUpdate });
                return false;
              }),
            ),
          ),
          startWith(true),
        ),
      ]).pipe(
        map(([content, loading]) => {
          console.log('Content and loading: ', { content, loading });
          return { content, loading };
        }),
      );
    }

    return this.scullyRoutesService
      .getCurrent()
      .pipe(map((content) => ({ loading: false, content })));
  }).pipe(
    tap(({ content }: { loading: boolean; content: Frontmatter }) => {
      this.metaService.update({ ...content, url: `${environment.baseUrl}${content.route}` });
    }),
  );

  constructor(
    private scullyRoutesService: ScullyRoutesService,
    private metaService: MetaService,
    private swUpdate: SwUpdate,
    @Inject(DOCUMENT) private document: Document,
  ) {}
}

@NgModule({
  declarations: [BlogComponent, GiscusDirective],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':slug',
        component: BlogComponent,
      },
      {
        path: '**',
        component: BlogComponent,
      },
    ]),
    ScullyLibModule,
    AllBlogsBtnModule,
    ThemeTogglerModule,
  ],
})
export class BlogModule {}
