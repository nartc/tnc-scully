import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class Destroyable implements OnDestroy {
  protected $destroyed = new Subject();

  ngOnDestroy() {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
