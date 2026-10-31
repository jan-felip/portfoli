import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EDUCATION, EXPERIENCE } from '../data/profile';
import { About } from '../sections/about';
import { AboutHero } from '../sections/about-hero';
import { Chronology, ChronologySource } from '../sections/chronology';
import { Companies } from '../sections/companies';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-about-page',
  imports: [AboutHero, About, Companies, Spacer, Chronology, RouterLink],
  template: `
    <app-about-hero />
    <app-spacer />
    <app-about />
    <app-spacer />

    <!-- Trajectòria: cronologia de feina i estudis. -->
    <div class="region region-cv">
      <div class="region-cv__inner">
        <div class="region-cv__head">
          <h2 class="region-cv__title">Trajectòria</h2>
          <a class="block-panel__more" routerLink="/curriculum">
            Currículum complet <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
        <app-chronology [sources]="sources" />
      </div>
    </div>

    <app-spacer />
    <app-companies />
  `,
})
export class AboutPage {
  protected readonly sources: ChronologySource[] = [
    { label: 'Feina', icon: 'briefcase', entries: EXPERIENCE },
    { label: 'Estudis', icon: 'mortarboard', entries: EDUCATION },
  ];
}
