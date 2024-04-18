import { AfterContentChecked, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEllipsis]'
})
export class EllipsisDirective implements AfterContentChecked {
  private domElement: HTMLElement;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.domElement = this.elementRef.nativeElement;
  }

  ngAfterContentChecked(): void {
    this.setToolTip();
  }

  @HostListener('window:resize', ['$event.target'])
  setToolTip(): void {
    this.domElement.offsetWidth < this.domElement.scrollWidth
      ? this.renderer.setAttribute(this.domElement, 'title', this.domElement.innerHTML)
      : this.renderer.removeAttribute(this.domElement, 'title');
  }
}
