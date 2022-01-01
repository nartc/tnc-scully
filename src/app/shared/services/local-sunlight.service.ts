import { Injectable } from '@angular/core';
import { GeolocationService } from './geolocation.service';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class LocalSunlightService {
  constructor(private geolocation$: GeolocationService, private themeService: ThemeService) {}

  init() {
    let suncalc: typeof import('suncalc');
    this.geolocation$.subscribe({
      next: (position) => {
        if (!suncalc) {
          // @ts-ignore
          suncalc = require('suncalc');
        }
        const { latitude, longitude } = position.coords;
        const now = new Date();

        const { goldenHour, goldenHourEnd, dawn, dusk } = suncalc.getTimes(
          now,
          latitude,
          longitude,
        );

        if (now < dawn || now > dusk) {
          this.themeService.set('dark');
        } else if (now < goldenHourEnd || now > goldenHour) {
          this.themeService.set('twilight');
        } else {
          this.themeService.set('light');
        }
      },
      error: () => {
        this.themeService.load();
      },
    });
  }
}
