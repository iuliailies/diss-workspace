import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appContentEditable]'
})
export class ContentEditableDirective {
  private domElement: HTMLElement;
  private isFocused = false;
  @Output() focused = new EventEmitter();
  @Output() unfocused = new EventEmitter();

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.domElement = this.element.nativeElement;
    this.renderer.setAttribute(this.domElement, 'contenteditable', 'true');
    this.renderer.addClass(this.domElement, 'content-editable');
  }

  @HostListener('document:mousedown', ['$event'])
  onBlurClick(e: MouseEvent): void {
    if (e.target === this.domElement) {
      this.focused.emit();
      this.isFocused = true;
      return;
    }
    if (!this.isFocused) {
      return;
    }
    this.unfocused.emit();
    this.isFocused = false;
    this.domElement.scrollLeft = 0;
  }

  @HostListener('window:keydown.enter', ['$event'])
  onBlurEnter(): void {
    this.domElement.blur();
    if (!this.isFocused) {
      return;
    }
    this.unfocused.emit();
    this.isFocused = false;
    this.domElement.scrollLeft = 0;
  }
}
