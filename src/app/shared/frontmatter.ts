import { ScullyRoute } from '@scullyio/ng-lib';

export interface Frontmatter extends ScullyRoute {
  description?: string;
  date?: string;
  publishedDate?: string;
  updatedDate?: string;
  tags?: string[];
  url?: string;
  readingTime?: number;
}
