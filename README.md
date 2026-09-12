# Démo Angular Route Resources

Une application Angular minimale pour présenter l’association de ressources réactives aux routes.

## Ce que montre la démo

- une ressource bloquante liée à un paramètre de route et fournie comme `input` au composant ;
- une ressource `nonBlocking()` avec affichage de `loading`, `value` et `error` ;
- un `resource.reload()` sans renavigation ;
- deux ressources bloquantes exécutées en parallèle ;
- un cas d’erreur dédié où la ressource passe de `loading` à `error` ;
- une page pédagogique interactive sur `value`, `status`, `set()`, `reload()` et `error()` ;
- une hiérarchie parent/enfant où les ressources projet et tâche démarrent en parallèle ;
- une redirection avec `RedirectCommand` quand la ressource est absente.

La démo utilise des données simulées en mémoire et des délais artificiels pour rendre chaque comportement visible.

## Version et particularité du preview

- Angular `22.2.0-next.5`
- Node.js `22.13+`
- pnpm `11+`
- application standalone, CSS, sans SSR ni tests

Dans `22.2.0-next.5`, l’implémentation est déjà disponible mais certains exports/types sont encore préfixés par `ɵ`. Le code conserve ces alias localement pour rester fidèle à la version demandée. Les exemples de la documentation preview utilisent les noms publics qui ont suivi.

## Lancer la démo

```bash
pnpm install
pnpm start
```

Puis ouvrir `http://localhost:4200` et choisir un scénario.

Pour compiler la démo :

```bash
pnpm build
```

## Documentation

- [Data fetching with resources](https://next.angular.dev/guide/routing/data-fetching-with-resources)
- [Route API](https://next.angular.dev/api/router/Route)
- [Input binding du router](https://next.angular.dev/guide/routing/common-router-tasks#router-input-binding)

## Liens

- GitHub : https://github.com/RomainDood/demo-angular-route-resources
- StackBlitz : https://stackblitz.com/github/RomainDood/demo-angular-route-resources
