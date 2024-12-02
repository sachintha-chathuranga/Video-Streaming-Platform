import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
	selector: '[highlightDirective]',
	standalone: true,
})
export class HighlightDirectiveDirective {
	constructor(private element: ElementRef, private renderer: Renderer2) {}
	@HostListener('mouseenter') onMouseEnter() {
		this.renderer.setStyle(this.element.nativeElement, 'backgroundColor', 'yellow');
	}

	@HostListener('mouseleave') onMouseLeave() {
		this.renderer.removeStyle(this.element.nativeElement, 'backgroundColor');
	}
}
