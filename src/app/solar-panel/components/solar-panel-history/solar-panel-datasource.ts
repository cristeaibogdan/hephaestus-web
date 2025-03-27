import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge } from 'rxjs';
import { signal } from '@angular/core';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full.response';
import { toObservable } from '@angular/core/rxjs-interop';
import { SearchSolarPanelRequest } from '../../models/dtos/search-solar-panel.request';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { TranslocoService } from '@jsverse/transloco';
import { NotificationService } from 'src/app/services/notification.service';

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SolarPanelDataSource extends DataSource<Partial<GetSolarPanelFullResponse>> {
  
  private solarPanels$ = signal<Partial<GetSolarPanelFullResponse>[]>([]);
  
  sort!: MatSort;  
  paginator!: MatPaginator;
  pageSizeOptions = [2, 5, 10, 20, 40];

  constructor(
    private _solarPanelDataService: SolarPanelDataService,
    private _translocoService: TranslocoService,
    private _notifService: NotificationService
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Partial<GetSolarPanelFullResponse>[]> {
    return toObservable(this.solarPanels$);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  loadSolarPanels(searchSolarPanelRequest: SearchSolarPanelRequest) {
    console.log("searchSolarPanelRequest = ", searchSolarPanelRequest);

    this._solarPanelDataService.search(searchSolarPanelRequest).subscribe({
      next: response => {
        console.log("Response = ", response);

        if(response.content.length == 0) {
          this._notifService.showWarning(this._translocoService.translate("I18N.GENERAL_ERROR.EMPTY_PAGE"), 0);
        }

        this.solarPanels$.set(response.content);
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
        this.paginator.length = response.totalElements;
      },
      error: err => {
        this.solarPanels$.set([]);
        throw err; // re-throw to be handled by GlobalErrorHandler
      }
    });
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getSortedData(data: DataTableItem[]): DataTableItem[] {
  //   if (!this.sort || !this.sort.active || this.sort.direction === '') {
  //     return data;
  //   }

  //   return data.sort((a, b) => {
  //     const isAsc = this.sort?.direction === 'asc';
  //     switch (this.sort?.active) {
  //       case 'name': return compare(a.name, b.name, isAsc);
  //       case 'id': return compare(+a.id, +b.id, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
