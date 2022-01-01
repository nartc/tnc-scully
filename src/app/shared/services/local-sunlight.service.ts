import { Injectable } from '@angular/core';
import { getTimes } from 'suncalc';
import { GeolocationService } from './geolocation.service';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class LocalSunlightService {
  constructor(private geolocation$: GeolocationService, private themeService: ThemeService) {}

  init() {
    this.geolocation$.subscribe({
      next: (position) => {
        const { latitude, longitude } = position.coords;
        const now = new Date();

        const { goldenHour, goldenHourEnd, dawn, dusk } = getTimes(now, latitude, longitude);

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
