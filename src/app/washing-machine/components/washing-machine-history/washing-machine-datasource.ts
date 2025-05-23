import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { GetWashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/get-washing-machine-full.response';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Data source for the DataTableExample view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class WashingMachineDataSource extends DataSource<GetWashingMachineFullResponse> {  
  private washingMachines = signal<GetWashingMachineFullResponse[]>([]);

  constructor() {
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
}
