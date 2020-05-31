import { ScullyRoute } from '@scullyio/ng-lib';

export interface Frontmatter extends ScullyRoute {
  description?: string;
  date?: string;
  tags?: string[];
}
