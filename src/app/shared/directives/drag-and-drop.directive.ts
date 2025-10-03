import {Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2, inject} from "@angular/core";

@Directive({
    selector: '[dragAndDrop]',
    host: {
        '(dragover)': 'handleDragOver($event)',
        '(dragleave)': 'handleDragLeave($event)',
        '(drop)': 'handleDrop($event)',
    },
    standalone: true
})
export class DragAndDropDirective implements OnInit {
  @Output() filesDropped = new EventEmitter<FileList>();

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, "transition", "all 0.5s");
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "#f0f0f0");
    this.renderer.setStyle(this.el.nativeElement, "border", "2px dashed #2196F3");
  }

  handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }

  handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.filesDropped.emit(e.dataTransfer?.files);

    this.renderer.setStyle(this.el.nativeElement, "background-color", "");
    this.renderer.setStyle(this.el.nativeElement, "border", "");
  }
}