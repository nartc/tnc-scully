import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class Destroyable implements OnDestroy {
  protected $destroyed = new Subject();

  ngOnDestroy() {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
