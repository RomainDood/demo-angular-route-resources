import { Injectable } from '@angular/core';

export interface DemoItem {
  id: string;
  category: string;
  description: string;
  name: string;
  price: number;
}

export interface DemoReport {
  filter: string;
  rows: Array<{ label: string; value: number }>;
}

export interface DemoMetrics {
  generatedAt: string;
  requestNumber: number;
  value: number;
}

export interface ParallelResult {
  duration: number;
  startedAt: number;
}

export interface NestedProject {
  description: string;
  elapsed: number;
  id: string;
  name: string;
}

export interface NestedTask {
  elapsed: number;
  id: string;
  status: string;
  title: string;
}

@Injectable()
export class NestedRouteTrace {
  private startedAt = 0;

  start(): number {
    this.startedAt ||= performance.now();
    return this.startedAt;
  }
}

const items: Record<string, DemoItem> = {
  '1': {
    id: '1',
    category: 'Signals',
    description: 'Une ressource bloquante liée au paramètre :id.',
    name: 'Signal notebook',
    price: 24,
  },
  '2': {
    id: '2',
    category: 'Router',
    description: 'La vue reste gelée jusqu’à l’arrivée de la nouvelle ressource.',
    name: 'Route map',
    price: 42,
  },
};

let requestNumber = 0;

export function wait(delay: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay);
    const abort = () => {
      window.clearTimeout(timer);
      reject(new DOMException('The demo request was aborted.', 'AbortError'));
    };

    if (abortSignal?.aborted) {
      abort();
      return;
    }

    abortSignal?.addEventListener('abort', abort, { once: true });
  });
}

export async function loadItem(
  id: string,
  abortSignal: AbortSignal,
): Promise<DemoItem | undefined> {
  await wait(1200, abortSignal);
  return items[id];
}

export async function loadReport(
  filter: string,
  abortSignal: AbortSignal,
): Promise<DemoReport> {
  await wait(1800, abortSignal);

  if (filter === 'error') {
    throw new Error('Le serveur de démonstration a renvoyé une erreur.');
  }

  const multiplier = filter === 'team' ? 1.35 : filter === 'mine' ? 0.72 : 1;
  return {
    filter,
    rows: [
      { label: 'Navigation', value: Math.round(68 * multiplier) },
      { label: 'Resources', value: Math.round(91 * multiplier) },
      { label: 'Signals', value: Math.round(76 * multiplier) },
    ],
  };
}

export async function loadMetrics(abortSignal: AbortSignal): Promise<DemoMetrics> {
  await wait(900, abortSignal);
  requestNumber += 1;

  return {
    generatedAt: new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(),
    requestNumber,
    value: 70 + requestNumber * 4,
  };
}

export async function loadSummary(
  startedAt: number,
  abortSignal: AbortSignal,
): Promise<ParallelResult> {
  await wait(700, abortSignal);
  return { duration: Math.round(performance.now() - startedAt), startedAt };
}

export async function loadActivity(
  startedAt: number,
  abortSignal: AbortSignal,
): Promise<ParallelResult> {
  await wait(1400, abortSignal);
  return { duration: Math.round(performance.now() - startedAt), startedAt };
}

export async function loadProject(
  id: string,
  startedAt: number,
  abortSignal: AbortSignal,
): Promise<NestedProject> {
  await wait(2000, abortSignal);

  return {
    description: 'Un projet chargé par la route parente.',
    elapsed: Math.round(performance.now() - startedAt),
    id,
    name: 'Refonte du tableau de bord',
  };
}

export async function loadTask(
  id: string,
  startedAt: number,
  abortSignal: AbortSignal,
): Promise<NestedTask> {
  await wait(3000, abortSignal);

  return {
    elapsed: Math.round(performance.now() - startedAt),
    id,
    status: 'En cours',
    title: 'Présenter les Router Resources',
  };
}
