import { Component } from '@angular/core';
import { PageTitle } from '../sections/page-title';
import { Projects } from '../sections/projects';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-projects-page',
  imports: [PageTitle, Projects, Spacer],
  template: `
    <app-page-title
      eyebrow="Projectes"
      title="Coses que he construït"
      intro="Webs, eines i experiments. Alguns de classe, d’altres per a clients i molts per pura curiositat."
    />
    <app-spacer />
    <app-projects />
  `,
})
export class ProjectsPage {}
