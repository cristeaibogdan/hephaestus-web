import {Directive, ElementRef, EventEmitter, Output, Renderer2} from "@angular/core";

@Directive({
  selector:'[dragAndDrop]',
  host: {
    '(dragover)': 'handleDragOver($event)',
    '(dragleave)': 'handleDragLeave($event)',
    '(drop)': 'handleDrop($event)',
  }
})
export class DragAndDropDirective {

  @Output() filesDropped = new EventEmitter<FileList>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "#f0f0f0");
    this.renderer.setStyle(this.el.nativeElement, "border", "2px dashed #2196F3");
  }

  handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.filesDropped.emit(e.dataTransfer?.files);

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }
}