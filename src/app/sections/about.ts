import { Component } from '@angular/core';
import { PROFILE } from '../data/profile';
import { InView } from '../shared/in-view';

@Component({
  selector: 'app-about',
  imports: [InView],
  host: { class: 'region region-about' },
  template: `
    <div class="region-about__inner">
      <div class="block block-intro" appInView>
        <p class="block-intro__eyebrow">{{ about.eyebrow }}</p>
        <h1 class="block-intro__title">{{ about.title }}</h1>
        @for (paragraph of about.paragraphs; track $index) {
          <p class="block-intro__text">{{ paragraph }}</p>
        }
        <div class="block-intro__actions">
          <a class="block-intro__button block-intro__button--primary" [href]="'mailto:' + profile.email">
            <i class="bi bi-envelope" aria-hidden="true"></i>Escriu-me
          </a>
          @if (profile.links[0]; as link) {
            <a class="block-intro__button" [href]="link.href" target="_blank" rel="noopener">
              <i class="bi" [class]="'bi-' + link.icon" aria-hidden="true"></i>{{ link.label }}
            </a>
          }
        </div>
      </div>

      <aside class="block block-stats" aria-label="Resum" appInView>
        <p class="block-stats__label">En xifres</p>
        @for (stat of profile.stats; track stat.label) {
          <div class="block-stats__row">
            <span class="block-stats__name">
              <i class="bi" [class]="'bi-' + stat.icon" aria-hidden="true"></i>{{ stat.label }}
            </span>
            <span class="block-stats__value">{{ stat.value }}</span>
          </div>
        }
      </aside>
    </div>
  `,
})
export class About {
  protected readonly profile = PROFILE;
  protected readonly about = PROFILE.about;
}
