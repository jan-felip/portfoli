import { Component } from '@angular/core';
import { About } from '../sections/about';
import { Companies } from '../sections/companies';
import { Spacer } from '../sections/spacer';

@Component({
  selector: 'app-about-page',
  imports: [About, Companies, Spacer],
  template: `
    <app-about />
    <app-spacer />
    <app-companies />
  `,
})
export class AboutPage {}
