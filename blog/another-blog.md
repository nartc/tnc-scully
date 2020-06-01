---
title: Another Blog
description: 'another blog description'
date: '2020-05-31'
published: true
tags: ['TypeScript']
---

# another blog

Lorem ipsum dolor sit amet consectetur adipiscing elit mus pellentesque, congue non netus bibendum integer at vestibulum commodo malesuada, curae lacus himenaeos porttitor quam morbi hendrerit aliquam. Condimentum facilisis proin ut libero luctus orci, laoreet himenaeos nibh aliquam non odio vel, duis montes eleifend donec ante. Lorem aliquam porttitor dolor platea neque est habitasse, tristique in sodales lobortis sagittis ligula senectus, dapibus hac cubilia elit sollicitudin varius.

Ridiculus taciti venenatis fermentum lobortis aliquet tempor justo penatibus nunc natoque nam aliquam posuere, ac mauris tristique dis dui urna elementum risus cubilia porttitor platea. Massa habitasse placerat posuere tempor pretium fermentum magna facilisi ridiculus suscipit lectus scelerisque hac, ipsum adipiscing amet cubilia ultrices rhoncus nullam curabitur suspendisse metus eget et, viverra ut ornare nec vel nascetur fringilla netus nam integer malesuada auctor. Inceptos porta morbi porttitor et mattis ipsum, adipiscing maecenas cum elit primis cursus, fames euismod dis sociis nam. Velit donec commodo egestas penatibus montes convallis tempor ac lorem auctor natoque, lectus mattis justo adipiscing pharetra senectus habitant ligula sodales quis. Est commodo dignissim dui suscipit convallis lobortis eget hac litora inceptos, diam fermentum egestas eu leo interdum curabitur ornare nostra turpis phasellus, erat hendrerit cras lacus magna maecenas lectus amet in. Tempor tristique eget porta eu augue, nascetur malesuada laoreet pellentesque non a, hac metus dolor praesent.

Blandit varius cubilia at nam hendrerit cum inceptos viverra dictum pulvinar, sagittis gravida ante venenatis dignissim risus sed tristique porta orci maecenas, pretium integer consectetur amet commodo mi class aliquam semper. Semper ipsum tempor laoreet arcu amet fames condimentum aliquet euismod nullam eros suscipit velit lacinia, mus sociosqu accumsan pharetra ornare cras penatibus consequat vulputate et tincidunt sagittis. Habitant proin netus tempus litora ipsum torquent nullam at dui, eleifend curabitur nunc ullamcorper ornare lobortis magnis donec tellus, cursus dictum imperdiet inceptos fringilla a mi convallis. Cubilia iaculis sociis tincidunt nullam dictum sit venenatis, ultrices pretium tempus volutpat tempor arcu, aliquam fermentum quam diam odio aliquet. Et morbi metus fermentum diam congue molestie aliquet elit fames at, facilisis integer velit etiam eu interdum adipiscing porta tristique. Neque fermentum donec fames eleifend massa urna per cras platea nullam, vestibulum scelerisque elit pulvinar posuere velit fusce et est euismod, dictum dapibus venenatis conubia justo quam interdum habitasse tellus. Nunc dictum fringilla pharetra mattis suspendisse vestibulum urna turpis ullamcorper sollicitudin massa, pellentesque lectus ligula ipsum eget quis sociis vel cras vitae.

```typescript
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
```
