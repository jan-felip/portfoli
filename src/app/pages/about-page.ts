import { Component } from '@angular/core';
import { About } from '../sections/about';
import { AboutHero } from '../sections/about-hero';
import { Companies } from '../sections/companies';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-about-page',
  imports: [AboutHero, About, Companies, Spacer],
  template: `
    <app-about-hero />
    <app-spacer />
    <app-about />
    <app-spacer />
    <app-companies />
  `,
})
export class AboutPage {}
