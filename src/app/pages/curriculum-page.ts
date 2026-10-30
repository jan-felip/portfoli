import { Component } from '@angular/core';
import { CERTIFICATIONS, CvEntry, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE } from '../data/profile';
import { InView } from '../shared/in-view';
import { PageTitle } from '../sections/page-title';
import { Spacer } from '../sections/spacer';

interface CvGroup {
  id: string;
  title: string;
  icon: string;
  entries: CvEntry[];
}

@Component({
  selector: 'app-curriculum-page',
  imports: [PageTitle, Spacer, InView],
  template: `
    <app-page-title
      eyebrow="Currículum"
      title="Experiència i formació"
      intro="On he treballat, què he estudiat i què he certificat."
    >
      <a class="block-intro__button block-intro__button--primary reveal-item"
         style="animation-delay: 420ms" [href]="profile.cvFile" download>
        <i class="bi bi-download" aria-hidden="true"></i>Descarrega el CV en PDF
      </a>
    </app-page-title>

    <app-spacer />

    <div class="region region-cv">
      <div class="region-cv__inner">
        @for (group of groups; track group.id) {
          <section class="block block-cv" [attr.aria-labelledby]="'cv-' + group.id" appInView>
            <h2 class="block-cv__title" [id]="'cv-' + group.id">
              <i class="bi" [class]="'bi-' + group.icon" aria-hidden="true"></i>{{ group.title }}
            </h2>
            <ol class="block-cv__list">
              @for (entry of group.entries; track $index) {
                <li class="block-cv__item" [class.is-current]="entry.current">
                  <span class="block-cv__period">{{ entry.period }}</span>
                  <div class="block-cv__content">
                    <h3 class="block-cv__role">{{ entry.title }}</h3>
                    <p class="block-cv__place">{{ entry.place }}</p>
                    @if (entry.description) {
                      <p class="block-cv__text">{{ entry.description }}</p>
                    }
                    @if (entry.url) {
                      <a class="block-cv__link" [href]="entry.url" target="_blank" rel="noopener">
                        Veure certificat <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                      </a>
                    }
                  </div>
                </li>
              }
            </ol>
          </section>
        }

        <section class="block block-cv" aria-labelledby="cv-idiomes" appInView>
          <h2 class="block-cv__title" id="cv-idiomes">
            <i class="bi bi-translate" aria-hidden="true"></i>Idiomes
          </h2>
          <ul class="block-cv__chips">
            @for (lang of languages; track lang) {
              <li class="block-cv__chip">{{ lang }}</li>
            }
          </ul>
        </section>
      </div>
    </div>
  `,
})
export class CurriculumPage {
  protected readonly profile = PROFILE;
  protected readonly languages = LANGUAGES;
  protected readonly groups: CvGroup[] = [
    { id: 'experiencia', title: 'Experiència', icon: 'briefcase', entries: EXPERIENCE },
    { id: 'formacio', title: 'Formació', icon: 'mortarboard', entries: EDUCATION },
    { id: 'certificacions', title: 'Certificacions', icon: 'patch-check', entries: CERTIFICATIONS },
  ];
}
