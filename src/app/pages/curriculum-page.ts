import { Component } from '@angular/core';
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE } from '../data/profile';
import { InView } from '../shared/in-view';
import { CvGroup, CvTimeline } from '../sections/cv-timeline';
import { PageTitle } from '../sections/page-title';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-curriculum-page',
  imports: [PageTitle, Spacer, InView, CvTimeline],
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
        <app-cv-timeline [groups]="groups" />

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
    {
      id: 'certificacions',
      title: 'Certificacions',
      icon: 'patch-check',
      entries: CERTIFICATIONS,
      linkLabel: 'Veure certificat',
    },
  ];
}
