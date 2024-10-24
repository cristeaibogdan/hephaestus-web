import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HistoryViewComponent } from '../../../washing-machine/components/history/history-view/history-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SearchWashingMachineRequest } from '../../../washing-machine/models/dtos/search-washing-machine-request.dto';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';
import { ReturnType } from 'src/app/washing-machine/enums/return-type.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DamageType } from 'src/app/washing-machine/enums/damage-type.enum';
import { IdentificationMode } from 'src/app/washing-machine/enums/identification-mode.enum';
import { Recommendation } from 'src/app/washing-machine/enums/recommendation.enum';
import { WashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/washing-machine-full-response.dto';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'] 
})
export class HistoryComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private _washingMachineDataService:WashingMachineDataService,
    private _translate: TranslateService,
    private _notifService:NotificationService,
    private fb:FormBuilder
  ) { }

  washingMachines = new MatTableDataSource<Partial<WashingMachineFullResponse>>();
    
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

  ngOnInit() {
    this.loadPaginatedAndFiltered();    
  }

// *****************************************
// *** SORTING
// *****************************************

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
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
  changePage(e:PageEvent) {
    this.pageNumber = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadPaginatedAndFiltered();
  }

  onFilter() {
    // Return to the first page after clicking on filter
    this.pageNumber = 0;
    this.loadPaginatedAndFiltered();
  }

  onReset() {
    // Test to see if i need to return to first page after reset
    this.loadPaginatedAndFiltered();
  }

  // 3. USE VALUES OF PAGINATOR TO REQUEST DATA
  loadPaginatedAndFiltered() {
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
          this._notifService.showWarning(this._translate.instant("I18N.GENERAL_ERROR.EMPTY_PAGE"), 0);
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
      }
    });
  }

  private handleDate(value: string | null) {
    return (value)
      ? moment(value).format("YYYY-MM-DD")
      : null;
  }

// *****************************************
// *** TAB KEY HANDLER
// *****************************************

  @HostListener("window:keydown.tab", ["$event"])
  handleTab(event: KeyboardEvent) {
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

  onView(washingMachine: WashingMachineFullResponse) {
    if(!washingMachine.washingMachineDetail) {
      this._washingMachineDataService.loadExpanded(washingMachine.serialNumber).subscribe(response => {
        console.log("Response for details => ",response);
        washingMachine.washingMachineDetail = response.washingMachineDetail;
        washingMachine.washingMachineImages = response.washingMachineImages;

        this.openDialog(washingMachine);
      });
      
    } else {
      this.openDialog(washingMachine);
    }      
  }

  openDialog(washingMachine: WashingMachineFullResponse) { 
    this.dialog.open(HistoryViewComponent, {
      disableClose: true,
      width: '35%',
      data: { washingMachine: washingMachine },
      autoFocus: false
    });
  }
    
}
