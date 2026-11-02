import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

/** Lenis es carrega des del CDN (index.html) i queda com a global; no cal mantenir cap dependència. */
interface LenisInstance {
  scrollTo(target: number, options?: { immediate?: boolean; force?: boolean }): void;
  destroy(): void;
}
declare const Lenis: (new (options: object) => LenisInstance) | undefined;

/**
 * Marc comú de totes les pàgines. Les dades es canvien a src/app/data/profile.ts
 * i els estils viuen a src/styles/ (globals, estil tema Drupal).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Si el CDN no ha carregat, el web va igual amb el scroll normal.
      if (typeof Lenis === 'undefined') return;

      // Scroll suau. El bucle de fotogrames el porta el mateix Lenis (autoRaf).
      const lenis = new Lenis({
        lerp: 0.1,
        // La roda lateral (la cronologia) no és cosa de Lenis: la deixa passar tal qual.
        virtualScroll: ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) =>
          Math.abs(deltaX) <= Math.abs(deltaY),
        // Zones amb scroll propi (p. ex. el detall d'una targeta) fan scroll normal.
        prevent: (node: HTMLElement) => node.hasAttribute('data-lenis-prevent'),
        autoRaf: true,
      });

      // En canviar de pàgina, torna a dalt de tot sense animació.
      const sub = router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          if (!e.urlAfterRedirects.includes('#')) lenis.scrollTo(0, { immediate: true, force: true });
        });

      destroyRef.onDestroy(() => {
        sub.unsubscribe();
        lenis.destroy();
      });
    });
  }
}
