import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaginatorI18n extends MatPaginatorIntl {

  constructor(private _translate: TranslateService) {
    super();
    this.translateLabels();
    this._translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const rangeLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_OF");

    if (length === 0 || pageSize === 0) {
      return `0 ${rangeLabel} ${length }`;
    }
    
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${rangeLabel} ${length}`;
  }

  translateLabels() {
    this._translate.get([
      "I18N.MAT_INTERNAL.PAGINATOR_PRODUCTS_PER_PAGE_LABEL",
      "I18N.MAT_INTERNAL.PAGINATOR_FIRST_PAGE",
      "I18N.MAT_INTERNAL.PAGINATOR_LAST_PAGE",
      "I18N.MAT_INTERNAL.PAGINATOR_NEXT_PAGE",
      "I18N.MAT_INTERNAL.PAGINATOR_PREVIOUS_PAGE"
    ])
    .subscribe(() => {
      super.itemsPerPageLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_PRODUCTS_PER_PAGE_LABEL")
      super.firstPageLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_FIRST_PAGE");
      super.lastPageLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_LAST_PAGE");
      super.nextPageLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_NEXT_PAGE");
      super.previousPageLabel = this._translate.instant("I18N.MAT_INTERNAL.PAGINATOR_PREVIOUS_PAGE");
    });
    this.changes.next();
  }
}
