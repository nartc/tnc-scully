import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../shared/destroyable';
import { Frontmatter } from '../shared/frontmatter';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent extends Destroyable implements OnInit {
  blog$: Observable<Frontmatter> = this.scullyRoutesService
    .getCurrent()
    .pipe(shareReplay(1), takeUntil(this.$destroyed));

  constructor(private readonly scullyRoutesService: ScullyRoutesService) {
    super();
  }

  ngOnInit() {}
}
