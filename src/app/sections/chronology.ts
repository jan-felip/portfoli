import { Component, computed, input } from '@angular/core';
import { CvEntry } from '../data/profile';
import { InView } from '../shared/in-view';

export interface ChronologySource {
  /** Etiqueta del tipus d'entrada (p. ex. "Feina", "Estudis"). */
  label: string;
  icon: string;
  entries: CvEntry[];
}

interface ChronologyItem {
  year: string;
  label: string;
  icon: string;
  entry: CvEntry;
}

/**
 * Cronologia vertical: una línia amb un diamant per entrada, l'any a l'esquerra
 * i la targeta a la dreta. Barreja feina i estudis, del més antic al més nou.
 * L'entrada actual té el diamant ple i brillant.
 */
@Component({
  selector: 'app-chronology',
  imports: [InView],
  host: { class: 'block block-chronology' },
  template: `
    <ol class="block-chronology__list">
      @for (item of items(); track $index) {
        <li class="block-chronology__entry" [class.is-current]="item.entry.current" appInView>
          <span class="block-chronology__year">{{ item.year }}</span>
          <div class="block-chronology__card">
            <p class="block-chronology__kind">
              <i class="bi" [class]="'bi-' + item.icon" aria-hidden="true"></i>{{ item.label }}
              <span class="block-chronology__period">· {{ item.entry.period }}</span>
            </p>
            <div class="block-cv__head">
              @if (item.entry.logo) {
                <img class="block-cv__logo" [src]="item.entry.logo" alt="" loading="lazy" />
              }
              <div>
                <h3 class="block-cv__role">{{ item.entry.title }}</h3>
                <p class="block-cv__place">{{ item.entry.place }}</p>
              </div>
            </div>
            @if (item.entry.description) {
              <p class="block-cv__text">{{ item.entry.description }}</p>
            }
            @if (item.entry.tasks?.length) {
              <ul class="block-cv__tasks">
                @for (task of item.entry.tasks; track $index) {
                  <li>{{ task }}</li>
                }
              </ul>
            }
            @if (item.entry.tags?.length) {
              <ul class="block-cv__chips" aria-label="Tecnologies">
                @for (tag of item.entry.tags; track tag) {
                  <li class="block-cv__chip">{{ tag }}</li>
                }
              </ul>
            }
            @if (item.entry.url) {
              <a class="block-cv__link" [href]="item.entry.url" target="_blank" rel="noopener">
                Visita la web <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            }
          </div>
        </li>
      }
    </ol>
  `,
})
export class Chronology {
  readonly sources = input.required<ChronologySource[]>();

  protected readonly items = computed<ChronologyItem[]>(() =>
    this.sources()
      .flatMap((s) =>
        s.entries.map((entry) => ({
          // L'any és el primer número de "period" (p. ex. "2024 - actualitat" -> 2024).
          year: entry.period.match(/\d{4}/)?.[0] ?? entry.period,
          label: s.label,
          icon: s.icon,
          entry,
        })),
      )
      .sort((a, b) => a.year.localeCompare(b.year)),
  );
}
