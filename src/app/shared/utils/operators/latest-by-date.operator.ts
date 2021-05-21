import { tap } from 'rxjs/operators';

export function latestByDate<TItems extends Array<{ publishedAt?: string }> = Array<{ publishedAt?: string }>>() {
  return tap<TItems>((items) =>
    items.sort((a, b) => {
      const d1 = new Date(a.publishedAt);
      const d2 = new Date(b.publishedAt);
      return d2.getTime() - d1.getTime();
    }),
  );
}
