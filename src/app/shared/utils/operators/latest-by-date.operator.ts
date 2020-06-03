import { tap } from 'rxjs/operators';

export function latestByDate<TItems extends Array<{ date?: string }> = Array<{ date?: string }>>() {
  return tap<TItems>((items) =>
    items.sort((a, b) => {
      const d1 = new Date(a.date);
      const d2 = new Date(b.date);
      return d2.getTime() - d1.getTime();
    }),
  );
}
