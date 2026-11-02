import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EDUCATION, EXPERIENCE } from '../data/profile';
import { About } from '../sections/about';
import { AboutHero } from '../sections/about-hero';
import { Companies } from '../sections/companies';
import { Spacer } from '../sections/spacer';
import { Timeline, TimelineSource } from '../sections/timeline';

@Component({
  selector: 'app-about-page',
  imports: [AboutHero, About, Companies, Spacer, Timeline, RouterLink],
  template: `
    <app-about-hero />
    <app-spacer />
    <app-about />
    <app-spacer />

    <!-- Trajectòria: cronologia horitzontal de feina i estudis, de més recent a més antic. -->
    <div class="region region-timeline">
      <div class="region-timeline__inner">
        <div class="region-timeline__head">
          <h2 class="region-timeline__title">Trajectòria</h2>
          <a class="block-panel__more" routerLink="/curriculum">
            Currículum complet <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
        <app-timeline [sources]="sources" label="Trajectòria" />
      </div>
    </div>

    <app-spacer />
    <app-companies />
  `,
})
export class AboutPage {
  protected readonly sources: TimelineSource[] = [
    { label: 'Feina', icon: 'briefcase', entries: EXPERIENCE },
    { label: 'Estudis', icon: 'mortarboard', entries: EDUCATION },
  ];
}
