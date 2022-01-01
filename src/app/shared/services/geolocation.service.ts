import { Inject, Injectable } from '@angular/core';
import { NAVIGATOR } from '@ng-web-apis/common';
import { Observable, ReplaySubject, share, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeolocationService extends Observable<GeolocationPosition> {
  constructor(@Inject(NAVIGATOR) navigator: Navigator) {
    let watchPositionId: number;

    super((subscriber) => {
      if (!navigator) {
        subscriber.error('Your browser does not support Navigator');
      }

      if (!navigator.geolocation) {
        subscriber.error('Your browser does not support Geolocation');
      }

      watchPositionId = navigator.geolocation.watchPosition(
        (position) => subscriber.next(position),
        (positionError) => subscriber.error(positionError),
      );
    });

    return this.pipe(
      tap({
        finalize: () => {
          if (watchPositionId) {
            navigator.geolocation.clearWatch(watchPositionId);
          }
        },
      }),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: true,
        resetOnError: false,
        resetOnRefCountZero: true,
      }),
    );
  }
}
