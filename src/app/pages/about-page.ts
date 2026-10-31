import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EDUCATION, EXPERIENCE } from '../data/profile';
import { About } from '../sections/about';
import { AboutHero } from '../sections/about-hero';
import { Companies } from '../sections/companies';
import { CvGroup, CvTimeline } from '../sections/cv-timeline';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-about-page',
  imports: [AboutHero, About, Companies, Spacer, CvTimeline, RouterLink],
  template: `
    <app-about-hero />
    <app-spacer />
    <app-about />
    <app-spacer />

    <!-- Trajectòria: on he treballat i on he estudiat. -->
    <div class="region region-cv">
      <div class="region-cv__inner">
        <div class="region-cv__head">
          <h2 class="region-cv__title">Trajectòria</h2>
          <a class="block-panel__more" routerLink="/curriculum">
            Currículum complet <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
        <app-cv-timeline [groups]="groups" idPrefix="trajectoria-" />
      </div>
    </div>

    <app-spacer />
    <app-companies />
  `,
})
export class AboutPage {
  protected readonly groups: CvGroup[] = [
    { id: 'experiencia', title: 'On he treballat', icon: 'briefcase', entries: EXPERIENCE },
    { id: 'formacio', title: 'On he estudiat', icon: 'mortarboard', entries: EDUCATION },
  ];
}
