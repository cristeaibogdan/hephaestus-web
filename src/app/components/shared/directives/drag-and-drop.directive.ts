import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, Renderer2} from "@angular/core";

@Directive({
  selector:'[dragAndDrop]'})
export class DragAndDropDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Output() filesDropped = new EventEmitter<FileList>();

  @HostListener("dragover", ["$event"]) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "#f0f0f0");
    this.renderer.setStyle(this.el.nativeElement, "border", "2px dashed #2196F3");
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }

  @HostListener("drop", ["$event"]) onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.filesDropped.emit(e.dataTransfer?.files);

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }
}

