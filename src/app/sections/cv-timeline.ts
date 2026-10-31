import { Component, input } from '@angular/core';
import { CvEntry } from '../data/profile';
import { InView } from '../shared/in-view';

export interface CvGroup {
  id: string;
  title: string;
  icon: string;
  entries: CvEntry[];
  /** Text de l'enllaç de cada entrada (p. ex. "Veure certificat"). */
  linkLabel?: string;
}

/**
 * Llistes estil LinkedIn: on has treballat o estudiat, quan, i què hi has fet.
 * La fa servir la pàgina de Currículum i la de Sobre mi.
 */
@Component({
  selector: 'app-cv-timeline',
  imports: [InView],
  host: { class: 'cv-timeline' },
  template: `
    @for (group of groups(); track group.id) {
      <section class="block block-cv" [attr.aria-labelledby]="idPrefix() + group.id" appInView>
        <h2 class="block-cv__title" [id]="idPrefix() + group.id">
          <i class="bi" [class]="'bi-' + group.icon" aria-hidden="true"></i>{{ group.title }}
        </h2>
        <ol class="block-cv__list">
          @for (entry of group.entries; track $index) {
            <li class="block-cv__item" [class.is-current]="entry.current">
              <span class="block-cv__period">{{ entry.period }}</span>
              <div class="block-cv__content">
                <div class="block-cv__head">
                  @if (entry.logo) {
                    <img class="block-cv__logo" [src]="entry.logo" alt="" loading="lazy" />
                  }
                  <div>
                    <h3 class="block-cv__role">{{ entry.title }}</h3>
                    <p class="block-cv__place">{{ entry.place }}</p>
                  </div>
                </div>
                @if (entry.description) {
                  <p class="block-cv__text">{{ entry.description }}</p>
                }
                @if (entry.tasks?.length) {
                  <ul class="block-cv__tasks">
                    @for (task of entry.tasks; track $index) {
                      <li>{{ task }}</li>
                    }
                  </ul>
                }
                @if (entry.tags?.length) {
                  <ul class="block-cv__chips" aria-label="Tecnologies">
                    @for (tag of entry.tags; track tag) {
                      <li class="block-cv__chip">{{ tag }}</li>
                    }
                  </ul>
                }
                @if (entry.url) {
                  <a class="block-cv__link" [href]="entry.url" target="_blank" rel="noopener">
                    {{ group.linkLabel ?? 'Visita la web' }} <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </a>
                }
              </div>
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class CvTimeline {
  readonly groups = input.required<CvGroup[]>();
  /** Prefix dels id dels títols, per no repetir-los si surt dues vegades. */
  readonly idPrefix = input('cv-');
}
