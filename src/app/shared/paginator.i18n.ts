import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class PaginatorI18n extends MatPaginatorIntl {

  constructor(private _translocoService: TranslocoService) {
    super();
    this.translateLabels();
    this._translocoService.langChanges$.subscribe(() => {
      this.translateLabels();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const rangeLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_OF");

    if (length === 0 || pageSize === 0) {
      return `0 ${rangeLabel} ${length }`;
    }
    
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${rangeLabel} ${length}`;
  }

  translateLabels() { // Point of discussion.
    // this._translocoService.get([
    //   "I18N.MAT_INTERNAL.PAGINATOR_PRODUCTS_PER_PAGE_LABEL",
    //   "I18N.MAT_INTERNAL.PAGINATOR_FIRST_PAGE",
    //   "I18N.MAT_INTERNAL.PAGINATOR_LAST_PAGE",
    //   "I18N.MAT_INTERNAL.PAGINATOR_NEXT_PAGE",
    //   "I18N.MAT_INTERNAL.PAGINATOR_PREVIOUS_PAGE"
    // ])
    // .subscribe(() => {
      this.itemsPerPageLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_PRODUCTS_PER_PAGE_LABEL")
      this.firstPageLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_FIRST_PAGE");
      this.lastPageLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_LAST_PAGE");
      this.nextPageLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_NEXT_PAGE");
      this.previousPageLabel = this._translocoService.translate("I18N.MAT_INTERNAL.PAGINATOR_PREVIOUS_PAGE");
    // });
    // this._changeDetectorRef.detectChanges();
    this.changes.next();
  }
}
