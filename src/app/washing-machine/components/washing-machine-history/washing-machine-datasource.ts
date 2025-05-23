import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { GetWashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/get-washing-machine-full.response';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { SearchWashingMachineRequest } from '../../models/dtos/search-washing-machine.request';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslocoService } from '@jsverse/transloco';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

/**
 * Data source for the DataTableExample view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class WashingMachineDataSource extends DataSource<GetWashingMachineFullResponse> {  
  private washingMachines = signal<GetWashingMachineFullResponse[]>([]);

  sort!: MatSort;
  paginator!: MatPaginator;

  constructor(
    private _washingMachineDataService: WashingMachineDataService,
    private _notifService: NotificationService,
    private _translocoService: TranslocoService
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<GetWashingMachineFullResponse[]> {
    return toObservable(this.washingMachines);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  search(searchWashingMachineRequest: SearchWashingMachineRequest) {
    this._washingMachineDataService.loadPaginatedAndFiltered(searchWashingMachineRequest).subscribe({
      next: response => {

        if(response.content.length == 0) {
          this._notifService.showWarning(this._translocoService.translate("I18N.GENERAL_ERROR.EMPTY_PAGE"), 0);
        }

        this.washingMachines.set(response.content);
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
        this.paginator.length = response.totalElements;
      },
      error: err => {
        this.washingMachines.set([]);
        throw err; // re-throw to be handled by GlobalErrorHandler
      }
    });
  }
}
