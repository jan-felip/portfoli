import { Component } from '@angular/core';
import { COMPANIES } from '../data/profile';
import { InView } from '../shared/in-view';

/** Graella de logos d'empreses amb qui has treballat o col·laborat. */
@Component({
  selector: 'app-companies',
  imports: [InView],
  host: { class: 'region region-companies' },
  template: `
    <div class="region-companies__inner">
      <h2 class="region-companies__title">Amb qui he treballat</h2>
      <ul class="block block-logos">
        @for (company of companies; track company.name; let i = $index) {
          <li class="block-logos__item" appInView [style.transition-delay.ms]="i * 60">
            <!-- Sense url, l'<a> no té href i no és clicable. -->
            <a
              class="block-logos__link"
              [attr.href]="company.url ?? null"
              [attr.target]="company.url ? '_blank' : null"
              [attr.rel]="company.url ? 'noopener' : null"
            >
              @if (company.logo) {
                <img class="block-logos__image" [src]="company.logo" [alt]="company.name"
                     loading="lazy" (load)="fit($event)" />
              } @else {
                <span class="block-logos__name">{{ company.name }}</span>
              }
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class Companies {
  protected readonly companies = COMPANIES;

  /**
   * Iguala el pes visual dels logos: tots ocupen la mateixa àrea,
   * així un logo llarg queda més baix i un de compacte més alt.
   * L'àrea surt de la variable CSS --logo-area (en px²).
   */
  protected fit(event: Event): void {
    const img = event.target as HTMLImageElement;
    const ratio = img.naturalWidth / img.naturalHeight || 1;
    img.style.setProperty('--logo-ratio', ratio.toFixed(3));
  }
}
