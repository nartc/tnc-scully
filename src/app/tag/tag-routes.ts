import { Routes } from '@angular/router';
import { TagComponent } from './tag.component';

export const tagRoutes: Routes = [{ path: ':tagName', component: TagComponent }];
