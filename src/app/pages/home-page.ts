import { Component } from '@angular/core';
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
    <app-projects [featuredOnly]="true" heading="Projectes destacats" />
    <app-spacer />
    <app-companies />
  `,
})
export class HomePage {}
