import { Component } from '@angular/core';
import { PROFILE } from '../data/profile';
import { RevealText } from '../shared/reveal-text';

/**
 * Capçalera de Sobre mi: nom complet a l'esquerra (segon cognom a sota)
 * i una finestra quadrada amb la foto a la dreta.
 */
@Component({
  selector: 'app-about-hero',
  imports: [RevealText],
  host: { class: 'region region-about-hero' },
  template: `
    <div class="region-about-hero__inner">
      <!-- Franja entre dues línies de la graella: nom a l'esquerra, foto a la dreta. -->
      <div class="region-about-hero__band">
      <div class="block block-identity">
        <p class="block-identity__eyebrow reveal-item">Sobre mi</p>
        <h1 class="block-identity__name">
          <app-reveal-text class="block-identity__line" [text]="profile.fullName[0]" [delay]="80" />
          <app-reveal-text class="block-identity__line block-identity__line--muted"
                           [text]="profile.fullName[1]" [delay]="260" />
        </h1>
        <p class="block-identity__tagline reveal-item" style="animation-delay: 420ms">
          <i class="bi bi-geo-alt" aria-hidden="true"></i>{{ profile.location }}
        </p>
      </div>

      <figure class="block block-photo reveal-item" style="animation-delay: 200ms">
        @if (profile.photo) {
          <img class="block-photo__image" [src]="profile.photo" [alt]="profile.name" />
        } @else {
          <span class="block-photo__empty" aria-hidden="true">
            <i class="bi bi-person"></i>
          </span>
        }
      </figure>
      </div>
    </div>
  `,
})
export class AboutHero {
  protected readonly profile = PROFILE;
}
