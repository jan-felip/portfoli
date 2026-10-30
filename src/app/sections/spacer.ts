import { Component, input } from '@angular/core';

/** Franja buida de la graella entre regions. */
@Component({
  selector: 'app-spacer',
  host: {
    class: 'region region-spacer',
    '[class.region-spacer--sm]': 'size() === "sm"',
    'aria-hidden': 'true',
  },
  template: `<div class="region-spacer__inner"></div>`,
})
export class Spacer {
  readonly size = input<'sm' | 'lg'>('sm');
}
