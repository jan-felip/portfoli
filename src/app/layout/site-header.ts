import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PROFILE } from '../data/profile';
import { ThemeSwitch } from '../shared/theme-switch';

/** Píxels que cal baixar o pujar seguits (per sota de la capçalera) perquè s'amagui o torni. */
const SCROLL_DELTA = 6;

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, ThemeSwitch],
  host: { class: 'region region-header', role: 'banner' },
  template: `
    <div class="region-header__inner">
      <a class="block block-brand" routerLink="/" [attr.aria-label]="profile.name + ', inici'">
        <img class="block-brand__logo" src="logo-j.svg" alt="" width="22" height="22" />
      </a>

      <nav class="block block-nav" aria-label="Principal">
        @for (item of nav; track item.path) {
          <a
            class="block-nav__item"
            [routerLink]="item.path"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
          >{{ item.label }}</a>
        }
      </nav>

      <div class="region-header__end">
        <app-theme-switch />
        <a class="block block-actions" [href]="'mailto:' + profile.email">
          <i class="bi bi-envelope" aria-hidden="true"></i>
          <span>Contacte</span>
        </a>
      </div>
    </div>
  `,
})
export class SiteHeader {
  protected readonly profile = PROFILE;
  protected readonly nav = [
    { label: 'Inici', path: '/' },
    { label: 'Projectes', path: '/projectes' },
    { label: 'Currículum', path: '/curriculum' },
    { label: 'Sobre mi', path: '/sobre-mi' },
  ];

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.host.nativeElement;
      let last = window.scrollY;
      let offset = 0; // 0 = visible, -alçada = amagada
      let run = 0; // recorregut acumulat en la direcció actual (només per sota de la capçalera)
      let ticking = false;

      const apply = (value: number, snap: boolean) => {
        offset = value;
        el.classList.toggle('is-snap', snap);
        el.style.translate = `0 ${offset}px`;
      };

      const update = () => {
        ticking = false;
        const h = el.offsetHeight || 72;
        const y = Math.max(0, window.scrollY);
        const dy = y - last;
        last = y;

        // A la zona de dalt, la capçalera fa scroll amb la pàgina, com si no fos sticky.
        if (y <= h) {
          run = 0;
          apply(Math.min(0, Math.max(-h, offset - dy)), false);
          return;
        }

        // Més avall, baixar l'amaga d'una tirada i pujar la torna a mostrar.
        if (dy * run < 0) run = 0;
        run += dy;
        if (run > SCROLL_DELTA && offset !== -h) apply(-h, true);
        else if (run < -SCROLL_DELTA && offset !== 0) apply(0, true);
      };

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };

      // Si es tabula dins la capçalera amagada, torna a sortir.
      const onFocus = (e: FocusEvent) => {
        if ((e.target as HTMLElement).closest?.('.region-header')) apply(0, true);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('focusin', onFocus);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('focusin', onFocus);
      });
    });
  }
}
