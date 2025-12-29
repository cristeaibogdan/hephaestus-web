import { AfterViewInit, Component, HostListener, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SearchWashingMachineRequest } from '../../models/endpoints/search-washing-machine.endpoint';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';
import { ReturnType } from 'src/app/washing-machine/enums/return-type.enum';
import { DamageType } from 'src/app/washing-machine/enums/damage-type.enum';
import { IdentificationMode } from 'src/app/washing-machine/enums/identification-mode.enum';
import { Recommendation } from 'src/app/washing-machine/enums/recommendation.enum';
import { GetWashingMachineFullResponse } from '../../models/endpoints/get-washing-machine-full.endpoint';
import { WashingMachineHistoryViewComponent } from './washing-machine-history-view/washing-machine-history-view.component';
import { format } from 'date-fns';
import { TranslocoModule } from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';
import { MatInputModule } from '@angular/material/input';
import { DateFormatYYYYMMDDDirective } from 'src/app/shared/directives/date-format-yyyy-mm-dd.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { WashingMachineDataSource } from './washing-machine-datasource';

@Component({
  selector: 'app-washing-machine-history',
  templateUrl: './washing-machine-history.component.html',
  styleUrls: ['./washing-machine-history.component.scss'],
  providers: [ WashingMachineDataSource ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ToLabelPipe,
    DateFormatYYYYMMDDDirective,
    A11yModule,

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginator
  ]
})
export class WashingMachineHistoryComponent implements AfterViewInit {
  private dialog = inject(MatDialog);
  private _washingMachineDataService = inject(WashingMachineDataService);
  private fb = inject(FormBuilder);

  recommendation = Recommendation;

  dataSource: WashingMachineDataSource = inject(WashingMachineDataSource);
    
  displayedColumns: string[] = [
    "createdAt",
    "identificationMode",
    "manufacturer",
    "model",
    "type",
    "serialNumber",
    "returnType",
    "damageType",
    "recommendation",
    "actions"
  ]; 

// *****************************************
// *** SORTING
// *****************************************

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions = [2, 5, 10, 20, 40];

  // 1. SET PAGINATOR AND SORT TO DATA SOURCE
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.applySearchFilters();

    this.dataSource.sort.sortChange.subscribe(() => {
      this.dataSource.paginator.firstPage();
      this.applySearchFilters();
    });
  }
  
// *****************************************
// *** PAGINATOR and FILTERING
// *****************************************

  filterColumns: string[] = this.displayedColumns.map(column => column + "-filter");

  returnTypeOptions: ReturnType[] = Object.values(ReturnType);
  damageTypeOptions: DamageType[] = Object.values(DamageType);
  identificationModeOptions: IdentificationMode[] = Object.values(IdentificationMode);
  recommendationOptions: Recommendation[] = Object.values(Recommendation);

  filterForm = this.fb.group({
    manufacturer: null as string | null,
    damageType: null as DamageType | null,
    returnType: null as ReturnType | null,
    identificationMode: null as IdentificationMode | null,

    serialNumber: null as string | null,
    model: null as string | null,
    type: null as string | null,

    recommendation: null as Recommendation | null,

    createdAt: null as string | null
  });

  onFilter(): void {
    this.dataSource.paginator.firstPage();
    this.applySearchFilters();
  }

  onReset(): void {
    this.dataSource.paginator.firstPage();
    this.applySearchFilters();
  }

  // 2. USE VALUES OF FORM AND PAGINATOR TO REQUEST DATA
  applySearchFilters(): void {
    const searchWashingMachineRequest: SearchWashingMachineRequest = {
      pageIndex: this.dataSource.paginator.pageIndex,
      pageSize: this.dataSource.paginator.pageSize,

      sortByField: this.dataSource.sort.active,
      sortDirection: this.dataSource.sort.direction,

      identificationMode: this.filterForm.controls.identificationMode.value,
      manufacturer: this.filterForm.controls.manufacturer.value,
      model: this.filterForm.controls.model.value,
      type: this.filterForm.controls.type.value,
      serialNumber: this.filterForm.controls.serialNumber.value,
      returnType: this.filterForm.controls.returnType.value,
      damageType: this.filterForm.controls.damageType.value,
      recommendation: this.filterForm.controls.recommendation.value,
      createdAt: this.handleDate(this.filterForm.controls.createdAt.value) 
    };

    console.log("searchWashingMachineRequest = ", searchWashingMachineRequest);

    // 3. SEARCH WASHINGMACHINES AND UPDATE PAGINATOR FROM RESPONSE
    this.dataSource.search(searchWashingMachineRequest);
  }

  private handleDate(value: string | null): string | null {
    return (value)
      ? format(new Date(value), "yyyy-MM-dd")
      : null;
  }

// *****************************************
// *** TAB KEY HANDLER
// *****************************************

  @HostListener("window:keydown.tab", ["$event"]) // The host property is not able to listen to window or document events directly, so the cleanest approach here is to stick with @HostListener for this specific event.
  handleTab(event: KeyboardEvent): void {
    const focusedElement = document.activeElement as HTMLElement;

    const isOfTypeInput: boolean = focusedElement.tagName == "INPUT";
    const isOfTypeMatSelect: boolean = focusedElement.tagName == "MAT-SELECT";

    if (isOfTypeInput || isOfTypeMatSelect) {
      return;
    }

    document.getElementById("first")?.focus();
    event.preventDefault();
  }

// *****************************************
// *** ROW ACTIONS
// *****************************************

  onView(washingMachine: GetWashingMachineFullResponse): void {
    if(washingMachine.washingMachineDetail) {
      return this.openDialog(washingMachine);
    }

    this._washingMachineDataService.loadMany([washingMachine.serialNumber]).subscribe(response => {  
      washingMachine.washingMachineDetail = response[washingMachine.serialNumber].washingMachineDetail;
      washingMachine.washingMachineImages = response[washingMachine.serialNumber].washingMachineImages;
      this.openDialog(washingMachine);
    });
  }

  openDialog(washingMachine: GetWashingMachineFullResponse): void { 
    this.dialog.open(WashingMachineHistoryViewComponent, {
      disableClose: true,
      width: '35%',
      data: { washingMachine: washingMachine },
      autoFocus: false
    });
  }
    
}
