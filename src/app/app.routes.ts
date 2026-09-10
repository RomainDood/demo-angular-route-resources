import { inject, resource } from '@angular/core';
import {
  ɵnonBlocking as nonBlocking,
  ɵResourceContext as ResourceContext,
  ɵResourceResult as ResourceResult,
  RedirectCommand,
  Route,
  Router,
  Routes,
} from '@angular/router';
import {
  BlockingDemo,
  ErrorDemo,
  HomePage,
  NotFoundPage,
  NonBlockingDemo,
  ParallelDemo,
  ReloadDemo,
  ResourcesGuide,
} from './demo-pages';
import {
  loadActivity,
  loadItem,
  loadMetrics,
  loadReport,
  loadSummary,
} from './demo-data';

type ResourceRoute = Route & {
  resources?: (ctx: ResourceContext) => ResourceResult;
};

const resourceRoutes: ResourceRoute[] = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'blocking/:id',
    component: BlockingDemo,
    resources: (ctx) => {
      const router = inject(Router);

      return {
        item: resource({
          params: () => ctx.params()['id'],
          loader: async ({ params, abortSignal }) => {
            const item = await loadItem(params, abortSignal);

            if (!item) {
              throw new RedirectCommand(router.parseUrl('/not-found'));
            }

            return item;
          },
        }),
      };
    },
  },
  {
    path: 'non-blocking',
    component: NonBlockingDemo,
    resources: (ctx) => ({
      report: nonBlocking(
        resource({
          params: () => ctx.queryParams()['filter'] ?? 'all',
          loader: ({ params, abortSignal }) => loadReport(params, abortSignal),
        }),
      ),
    }),
  },
  {
    path: 'error',
    component: ErrorDemo,
    resources: () => ({
      failure: nonBlocking(
        resource({
          loader: ({ abortSignal }) => loadReport('error', abortSignal),
        }),
      ),
    }),
  },
  {
    path: 'reload',
    component: ReloadDemo,
    resources: () => ({
      metrics: resource({
        loader: ({ abortSignal }) => loadMetrics(abortSignal),
      }),
    }),
  },
  {
    path: 'parallel',
    component: ParallelDemo,
    resources: () => {
      const navigationStartedAt = performance.now();

      return {
        summary: resource({
          loader: ({ abortSignal }) =>
            loadSummary(navigationStartedAt, abortSignal),
        }),
        activity: resource({
          loader: ({ abortSignal }) =>
            loadActivity(navigationStartedAt, abortSignal),
        }),
      };
    },
  },
  {
    path: 'resources',
    component: ResourcesGuide,
  },
  {
    path: 'not-found',
    component: NotFoundPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const routes: Routes = resourceRoutes;
