import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HistoryViewComponent } from './history-view/history-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageRequestDTO } from '../../../washing-machine/models/dtos/page-request.dto';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { WashingMachineDTO } from 'src/app/washing-machine/models/dtos/washing-machine.dto';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';
import { ReturnType } from 'src/app/washing-machine/enums/return-type.enum';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'] 
})
export class HistoryComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private _washingMachineDataService:WashingMachineDataService,
    private fb:FormBuilder
  ) { }

  washingMachines = new MatTableDataSource<WashingMachineDTO>();
    
  displayedColumns: string[] = [
    "createdAt",
    "manufacturer",
    "damageType",
    "returnType",
    "identificationMode",
    "serialNumber",
    "model",
    "type",
    "damageLevel",
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

  filterForm = this.fb.group({
    category: null,
    manufacturer: null,
    damageType: null,
    returnType: null,
    identificationMode: null,

    serialNumber: null,
    model: null,
    type: null,

    damageLevel: null,
    recommendation: null,

    createdAt: null
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
    const pageRequestDTO:PageRequestDTO = {
      pageIndex: this.pageNumber,
      pageSize: this.pageSize,
      category: this.filterForm.value.category!,
      manufacturer: this.filterForm.value.manufacturer!,
      damageType: this.filterForm.value.damageType!,
      returnType: this.filterForm.value.returnType!,
      identificationMode: this.filterForm.value.identificationMode!,
      serialNumber: this.filterForm.value.serialNumber!,
      model: this.filterForm.value.model!,
      type: this.filterForm.value.type!,
      damageLevel: this.filterForm.value.damageLevel!,
      recommendation: this.filterForm.value.recommendation!,
      createdAt: this.handleDate(this.filterForm.value.createdAt!)!     
    };

    console.log("pageRequestDTO = ", pageRequestDTO);

    // 4. UPDATE VALUES OF PAGINATOR FROM RESPONSE
    this._washingMachineDataService.loadPaginatedAndFiltered(pageRequestDTO).subscribe({
      next: response => {
        console.log("Response = ",response);
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

  handleDate(value:string) {
    return (value == null)
      ? null
      : moment(this.filterForm.value.createdAt!).format("YYYY-MM-DD");
  }

// *****************************************
// *** TAB KEY HANDLER
// *****************************************

  @HostListener("window:keydown.tab", ["$event"])
  handleTab(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;

    if (!(focusedElement.tagName == "INPUT")) {
      document.getElementById("first")?.focus();
      event.preventDefault();
    }
  }

// *****************************************
// *** ROW ACTIONS
// *****************************************

  onView(washingMachine:WashingMachineDTO) {
    if(!washingMachine.washingMachineDetailsDTO) {
      this._washingMachineDataService.loadExpanded(washingMachine.serialNumber).subscribe(response => {
        console.log("Response for details => ",response);
        washingMachine.washingMachineDetailsDTO = response.washingMachineDetails;
        washingMachine.washingMachineImages = response.washingMachineImages;

        this.openDialog(washingMachine);
      });
      
    } else {
      this.openDialog(washingMachine);
    }      
  }

  openDialog(washingMachine: WashingMachineDTO) { 
    const dialogRef = this.dialog.open(HistoryViewComponent, {
      disableClose: true,
      width: '35%',
      data: { washingMachine: washingMachine },
      autoFocus: false
    });
  }
    
}
