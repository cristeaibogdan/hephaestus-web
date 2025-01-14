import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { SearchWashingMachineRequest } from '../../models/dtos/search-washing-machine.request';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';
import { ReturnType } from 'src/app/washing-machine/enums/return-type.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { DamageType } from 'src/app/washing-machine/enums/damage-type.enum';
import { IdentificationMode } from 'src/app/washing-machine/enums/identification-mode.enum';
import { Recommendation } from 'src/app/washing-machine/enums/recommendation.enum';
import { GetWashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/get-washing-machine-full.response';
import { WashingMachineHistoryViewComponent } from './washing-machine-history-view/washing-machine-history-view.component';
import { format } from 'date-fns';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';
import { MatInputModule } from '@angular/material/input';
import { DateFormatYYYYMMDDDirective } from 'src/app/shared/directives/date-format-yyyy-mm-dd.directive';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-washing-machine-history',
  templateUrl: './washing-machine-history.component.html',
  styleUrls: ['./washing-machine-history.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ToLabelPipe,
    DateFormatYYYYMMDDDirective,
    A11yModule,

    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginator
  ]
})
export class WashingMachineHistoryComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private _washingMachineDataService: WashingMachineDataService,
    private _translocoService: TranslocoService,
    private _notifService: NotificationService,
    private fb: FormBuilder
  ) { }

  readonly recommendation = Recommendation;

  washingMachines = new MatTableDataSource<Partial<GetWashingMachineFullResponse>>();
    
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

  ngOnInit(): void {
    this.loadPaginatedAndFiltered();
  }

// *****************************************
// *** SORTING
// *****************************************

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.washingMachines.sort = this.sort;
  }
  
// *****************************************
// *** PAGINATOR and FILTERING
// *****************************************

  filterColumns: string[] = this.displayedColumns.map(column => column + "-filter");

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  
  // 1. STARTING VALUES FOR PAGINATOR
  pageNumber = 0;
  pageSize = 10;

  totalElements = 0;
  pageSizeOptions = [2, 5, 10, 20, 40];

  // 2. UPDATE VALUES FOR PAGINATOR ON EACH PAGE CHANGE
  changePage(e:PageEvent): void {
    this.pageNumber = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadPaginatedAndFiltered();
  }

  onFilter(): void {
    // Return to the first page after clicking on filter
    this.pageNumber = 0;
    this.loadPaginatedAndFiltered();
  }

  onReset(): void {
    // Test to see if i need to return to first page after reset
    this.loadPaginatedAndFiltered();
  }

  // 3. USE VALUES OF PAGINATOR TO REQUEST DATA
  loadPaginatedAndFiltered(): void {
    const searchWashingMachineRequest: SearchWashingMachineRequest = {
      pageIndex: this.pageNumber,
      pageSize: this.pageSize,
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

    // 4. UPDATE VALUES OF PAGINATOR FROM RESPONSE
    this._washingMachineDataService.loadPaginatedAndFiltered(searchWashingMachineRequest).subscribe({
      next: response => {
        console.log("Response = ",response);

        if(response.content.length == 0) {
          this._notifService.showWarning(this._translocoService.translate("I18N.GENERAL_ERROR.EMPTY_PAGE"), 0);
        }

        this.washingMachines.data = response.content;
        this.pageNumber = response.number;
        this.pageSize = response.size;
        this.totalElements = response.totalElements;
      },
      error: err => {
        this.washingMachines.data = [];
        this.pageNumber = 0;
        this.totalElements = 0;
        throw err; // re-throw to be handled by GlobalErrorHandler
      }
    });
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
    
    // this._washingMachineDataService.load(washingMachine.serialNumber).subscribe(response => {
    //   console.log("Response for details => ", response);

    //   washingMachine.washingMachineDetail = response.washingMachineDetail;
    //   washingMachine.washingMachineImages = response.washingMachineImages;

    //   this.openDialog(washingMachine);
    // });

    this._washingMachineDataService.loadMany([washingMachine.serialNumber]).subscribe(response => {
      console.log("Response for details => ", response);

      const washingMachineDetail = response[washingMachine.serialNumber];
      if (washingMachineDetail) {
        washingMachine.washingMachineDetail = washingMachineDetail.washingMachineDetail;
        washingMachine.washingMachineImages = washingMachineDetail.washingMachineImages;
      }

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
