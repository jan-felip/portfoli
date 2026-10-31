import { Component } from '@angular/core';
import { PROJECTS } from '../data/profile';
import { Companies } from '../sections/companies';
import { Hero } from '../sections/hero';
import { Projects } from '../sections/projects';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-home-page',
  imports: [Hero, Projects, Companies, Spacer],
  template: `
    <app-hero />
    <app-spacer />
    <app-projects [items]="featured" heading="Projectes destacats" panelId="destacats" moreLink="/projectes" [carousel]="true" />
    <app-spacer />
    <app-companies />
  `,
})
export class HomePage {
  protected readonly featured = PROJECTS.filter((p) => p.featured);
}
