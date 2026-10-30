import { Directive, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';

/**
 * Afegeix la classe "is-inview" quan l'element entra a la pantalla (un sol cop).
 */
@Directive({
  selector: '[appInView]',
  host: { class: 'in-view', '[class.is-inview]': 'seen()' },
})
export class InView {
  protected readonly seen = signal(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.seen.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
