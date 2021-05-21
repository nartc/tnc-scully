import { ScullyRoute } from '@scullyio/ng-lib';

export interface Frontmatter extends ScullyRoute {
  description?: string;
  date?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  url?: string;
  readingTime?: number;
}
