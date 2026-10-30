import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

/**
 * Marc comú de totes les pàgines. Les dades es canvien a src/app/data/profile.ts
 * i els estils viuen a src/styles/ (globals, estil tema Drupal).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
