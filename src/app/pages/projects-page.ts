import { Component } from '@angular/core';
import { COLLABORATIONS, PROJECTS } from '../data/profile';
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
    <app-projects [items]="projects" heading="Projectes propis" />

    <app-spacer />
    <app-page-title
      size="sm"
      eyebrow="Col·laboracions"
      title="Webs on he col·laborat"
      intro="A Use-It anem rotant projectes. En unes webs hi he fet gran part de la feina i en d’altres hi he donat un cop de mà."
    />
    <app-spacer />
    <app-projects [items]="collaborations" heading="Col·laboracions" panelId="col-laboracions" countLabel="webs" />
  `,
})
export class ProjectsPage {
  protected readonly projects = PROJECTS;
  protected readonly collaborations = COLLABORATIONS;
}
