import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Injectable, signal } from '@angular/core';
import { GetSolarPanelFullResponse } from "../models/endpoints/get-solar-panel-full.endpoint";
import { toObservable } from '@angular/core/rxjs-interop';
import { SearchSolarPanelRequest } from "../models/endpoints/search-solar-panel.endpoint";
import { SolarPanelApi } from '../solar-panel.api';
import { TranslocoService } from '@jsverse/transloco';
import {NotificationService} from "../../../shared/services/notification.service";

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class HistoryDatasource extends DataSource<GetSolarPanelFullResponse> {

  private solarPanels = signal<GetSolarPanelFullResponse[]>([]);

  sort!: MatSort;
  paginator!: MatPaginator;

  constructor(
    private _solarPanelApi: SolarPanelApi,
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
  connect(): Observable<GetSolarPanelFullResponse[]> {
    return toObservable(this.solarPanels);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  search(searchSolarPanelRequest: SearchSolarPanelRequest): void {
    this._solarPanelApi.search(searchSolarPanelRequest).subscribe({
      next: response => {

        if(response.content.length == 0) {
          this._notifService.showWarning(this._translocoService.translate("I18N.GENERAL_ERROR.EMPTY_PAGE"));
        }

        this.solarPanels.set(response.content);
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
        this.paginator.length = response.totalElements;
      },
      error: err => {
        this.solarPanels.set([]);
        throw err; // re-throw to be handled by GlobalErrorHandler
      }
    });
  }
}

