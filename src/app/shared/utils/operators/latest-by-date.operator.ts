import { tap } from 'rxjs/operators';

export function latestByDate<TItems extends Array<{ publishedDate?: string }> = Array<{ publishedDate?: string }>>() {
  return tap<TItems>((items) =>
    items.sort((a, b) => {
      const d1 = new Date(a.publishedDate);
      const d2 = new Date(b.publishedDate);
      return d2.getTime() - d1.getTime();
    }),
  );
}
