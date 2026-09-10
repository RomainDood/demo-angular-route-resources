import { Component, inject, input, Resource } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {
  DemoItem,
  DemoMetrics,
  DemoReport,
  ParallelResult,
} from './demo-data';

@Component({
  template: `
    <section class="hero">
      <p class="eyebrow">Angular Router · preview</p>
      <h1>Les ressources suivent enfin les routes.</h1>
      <p class="hero-copy">
        Cinq mini-expériences pour montrer comment <code>resources</code>
        connecte navigation, signals et chargement de données.
      </p>
    </section>

    <section class="demo-grid" aria-label="Démonstrations">
      <a class="demo-card" routerLink="/blocking/1">
        <span class="card-index">01</span>
        <h2>Blocking resource</h2>
        <p>La route attend sa donnée et la reçoit directement comme input.</p>
        <span class="card-link">Ouvrir la démo <span>→</span></span>
      </a>
      <a class="demo-card" routerLink="/non-blocking" [queryParams]="{ filter: 'all' }">
        <span class="card-index">02</span>
        <h2>Non-blocking resource</h2>
        <p>La vue s’affiche immédiatement et observe loading, value et error.</p>
        <span class="card-link">Ouvrir la démo <span>→</span></span>
      </a>
      <a class="demo-card" routerLink="/reload">
        <span class="card-index">03</span>
        <h2>Reload ciblé</h2>
        <p>Un resource.reload() rafraîchit la donnée sans renaviguer.</p>
        <span class="card-link">Ouvrir la démo <span>→</span></span>
      </a>
      <a class="demo-card" routerLink="/parallel">
        <span class="card-index">04</span>
        <h2>Chargements parallèles</h2>
        <p>Deux ressources d’une même route partent ensemble, sans waterfall.</p>
        <span class="card-link">Ouvrir la démo <span>→</span></span>
      </a>
      <a class="demo-card" routerLink="/error">
        <span class="card-index">05</span>
        <h2>Erreur de chargement</h2>
        <p>Le loading se termine par une erreur visible dans le composant.</p>
        <span class="card-link">Ouvrir la démo <span>→</span></span>
      </a>
    </section>

    <p class="tip"><strong>À retenir :</strong> une route décrit maintenant aussi les données dont sa vue a besoin.</p>
  `,
  imports: [RouterLink],
})
export class HomePage {}

@Component({
  template: `
    <a class="back-link" routerLink="/">← Toutes les démos</a>
    <section class="demo-heading">
      <div>
        <p class="eyebrow">01 · Route resource bloquante</p>
        <h1>La donnée devient un input.</h1>
        <p>La navigation attend 1,2 seconde avant d’activer la vue.</p>
      </div>
      <span class="status-pill status-pill--green">Route prête</span>
    </section>

    <nav class="switcher" aria-label="Changer de produit">
      <a routerLink="/blocking/1" routerLinkActive="switcher__link--active">Produit 1</a>
      <a routerLink="/blocking/2" routerLinkActive="switcher__link--active">Produit 2</a>
      <a routerLink="/blocking/404" routerLinkActive="switcher__link--active">Produit absent</a>
    </nav>

    <article class="result-panel">
      <div class="product-mark">{{ item().id }}</div>
      <div>
        <span class="kicker">{{ item().category }}</span>
        <h2>{{ item().name }}</h2>
        <p>{{ item().description }}</p>
        <div class="metric-row">
          <span>Prix démo</span>
          <strong>{{ item().price }} €</strong>
        </div>
      </div>
    </article>

    <div class="explanation">
      <code>item = input.required&lt;DemoItem&gt;()</code>
      <span>Le router déballe la ressource bloquante avant le binding.</span>
    </div>
  `,
  imports: [RouterLink, RouterLinkActive],
})
export class BlockingDemo {
  readonly item = input.required<DemoItem>();
}

@Component({
  template: `
    <a class="back-link" routerLink="/">← Toutes les démos</a>
    <section class="demo-heading">
      <div>
        <p class="eyebrow">02 · Resource non bloquante</p>
        <h1>La vue n’attend plus.</h1>
        <p>Changez le filtre : la route reste montée pendant le rechargement.</p>
      </div>
      <span class="status-pill status-pill--blue">UI réactive</span>
    </section>

    <nav class="filter-bar" aria-label="Filtrer le rapport">
      <a routerLink="/non-blocking" [queryParams]="{ filter: 'all' }" routerLinkActive="filter-bar__item--active" [routerLinkActiveOptions]="{ exact: true }">Tout</a>
      <a routerLink="/non-blocking" [queryParams]="{ filter: 'mine' }" routerLinkActive="filter-bar__item--active">Mon équipe</a>
      <a routerLink="/non-blocking" [queryParams]="{ filter: 'team' }" routerLinkActive="filter-bar__item--active">Tous</a>
      <a routerLink="/non-blocking" [queryParams]="{ filter: 'error' }" routerLinkActive="filter-bar__item--active">Simuler une erreur</a>
    </nav>

    <article class="result-panel report-panel">
      @if (report().isLoading()) {
        <div class="loading-state">
          <span class="loader"></span>
          <div>
            <strong>Le rapport se recharge…</strong>
            <p>La navigation est déjà affichée.</p>
          </div>
        </div>
      } @else if (report().error(); as error) {
        <div class="error-state">
          <span class="error-icon">!</span>
          <div>
            <strong>Impossible de charger ce rapport.</strong>
            <p>{{ error.message }}</p>
          </div>
        </div>
      } @else if (report().hasValue()) {
        <div class="report-header">
          <div>
            <span class="kicker">Filtre actif</span>
            <h2>{{ report().value().filter }}</h2>
          </div>
          <span class="status-pill status-pill--green">Donnée reçue</span>
        </div>
        @for (row of report().value().rows; track row.label) {
          <div class="bar-row">
            <span>{{ row.label }}</span>
            <div class="bar-track"><span [style.width.%]="row.value"></span></div>
            <strong>{{ row.value }}</strong>
          </div>
        }
      }
    </article>

    <div class="explanation">
      <code>report = input.required&lt;Resource&lt;DemoReport&gt;&gt;()</code>
      <span><code>nonBlocking()</code> expose l’état complet au composant.</span>
    </div>
  `,
  imports: [RouterLink, RouterLinkActive],
})
export class NonBlockingDemo {
  readonly report = input.required<Resource<DemoReport>>();
}

@Component({
  template: `
    <a class="back-link" routerLink="/">← Toutes les démos</a>
    <section class="demo-heading">
      <div>
        <p class="eyebrow">05 · Erreur de chargement</p>
        <h1>Quand le loading échoue.</h1>
        <p>La ressource démarre en loading, puis expose son erreur sans casser la route.</p>
      </div>
      <span class="status-pill status-pill--orange">Erreur prévue</span>
    </section>

    <article class="result-panel report-panel error-demo-panel">
      @if (failure().isLoading()) {
        <div class="loading-state">
          <span class="loader"></span>
          <div>
            <strong>Chargement du rapport…</strong>
            <p>Observez cet état pendant environ 1,8 seconde.</p>
          </div>
        </div>
      } @else if (failure().error(); as error) {
        <div class="error-state">
          <span class="error-icon">!</span>
          <div>
            <strong>Le chargement a échoué.</strong>
            <p>{{ error.message }}</p>
            <span class="error-code">Resource status: error</span>
          </div>
        </div>
      }
    </article>

    <div class="explanation">
      <code>failure().isLoading() → failure().error()</code>
      <span>Avec <code>nonBlocking()</code>, l’erreur est disponible comme signal.</span>
    </div>
  `,
  imports: [RouterLink],
})
export class ErrorDemo {
  readonly failure = input.required<Resource<DemoReport>>();
}

@Component({
  template: `
    <a class="back-link" routerLink="/">← Toutes les démos</a>
    <section class="demo-heading">
      <div>
        <p class="eyebrow">03 · Reload sans navigation</p>
        <h1>Rafraîchir, sans repartir de zéro.</h1>
        <p>Le bouton appelle reload() sur une seule ressource de la route.</p>
      </div>
      <span class="status-pill status-pill--purple">Même URL</span>
    </section>

    <article class="result-panel refresh-panel">
      <div class="refresh-orb">↻</div>
      <div class="refresh-content">
        <span class="kicker">Valeur courante</span>
        <div class="big-number">{{ metrics().value }}</div>
        <p>Générée à {{ metrics().generatedAt }} · requête #{{ metrics().requestNumber }}</p>
        <button type="button" (click)="refresh()">Rafraîchir la ressource <span>↻</span></button>
      </div>
    </article>

    <div class="explanation">
      <code>inject(ActivatedRoute).resources?.['metrics'].reload()</code>
      <span>Aucun guard, matching ou changement d’URL n’est relancé.</span>
    </div>
  `,
  imports: [RouterLink],
})
export class ReloadDemo {
  readonly metrics = input.required<DemoMetrics>();
  private readonly route = inject(ActivatedRoute);

  refresh(): void {
    const resources = (this.route as ActivatedRoute & {
      resources?: Record<string, Resource<unknown>>;
    }).resources;
    const metrics = resources?.['metrics'] as
      | (Resource<unknown> & { reload(): boolean })
      | undefined;
    metrics?.reload();
  }
}

@Component({
  template: `
    <a class="back-link" routerLink="/">← Toutes les démos</a>
    <section class="demo-heading">
      <div>
        <p class="eyebrow">04 · Ressources parallèles</p>
        <h1>Le temps du plus lent, pas la somme.</h1>
        <p>Deux ressources bloquantes démarrent pendant la même navigation.</p>
      </div>
      <span class="status-pill status-pill--orange">Concurrent</span>
    </section>

    <div class="parallel-grid">
      <article class="result-panel timing-card">
        <span class="kicker">Ressource A · 700 ms</span>
        <h2>Résumé</h2>
        <p>Prête après <strong>{{ summary().duration }} ms</strong></p>
        <div class="timing-bar"><span [style.width.%]="summary().duration / 14"></span></div>
      </article>
      <article class="result-panel timing-card">
        <span class="kicker">Ressource B · 1400 ms</span>
        <h2>Activité</h2>
        <p>Prête après <strong>{{ activity().duration }} ms</strong></p>
        <div class="timing-bar timing-bar--orange"><span [style.width.%]="activity().duration / 14"></span></div>
      </article>
    </div>

    <div class="parallel-callout">
      <strong>La navigation s’active autour de {{ activity().duration }} ms.</strong>
      <span>Les deux loaders partagent le même départ : le résultat est proche du maximum, pas de 700 + 1400 ms.</span>
    </div>
  `,
  imports: [RouterLink],
})
export class ParallelDemo {
  readonly summary = input.required<ParallelResult>();
  readonly activity = input.required<ParallelResult>();
}

@Component({
  template: `
    <section class="not-found">
      <span class="product-mark">?</span>
      <p class="eyebrow">RedirectCommand</p>
      <h1>Cette ressource n’existe pas.</h1>
      <p>La ressource bloquante a annulé la navigation et redirigé vers cette route.</p>
      <a class="primary-link" routerLink="/blocking/1">Revenir à une ressource valide →</a>
    </section>
  `,
  imports: [RouterLink],
})
export class NotFoundPage {}
