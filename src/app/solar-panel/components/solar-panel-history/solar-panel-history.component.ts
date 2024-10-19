import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full-response.dto';
import { MatSort } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { SearchSolarPanelRequest } from '../../models/dtos/search-solar-panel-request.dto';
import { SolarPanelHistoryViewComponent } from './solar-panel-history-view/solar-panel-history-view.component';
import { MatDialog } from '@angular/material/dialog';


const DUMMY_DATA: GetSolarPanelFullResponse[] = [
  {
    createdAt: new Date('2022-01-01'),
    category: "Solar Panel",
    manufacturer: 'SolarCorp',
    model: 'SC-1000',
    type: 'Monocrystalline',
    serialNumber: 'SN123456789',
    recommendation: SolarPanelRecommendation.REPAIR,
    solarPanelDamage: {
      hotSpots: false,
      microCracks: false,
      snailTrails: false,
      brokenGlass: false,
      additionalDetails: ''
    },
  },
  {
    createdAt: new Date('2022-05-15'),
    category: "Solar Panel",
    manufacturer: 'SunPower',
    model: 'SP-2000',
    type: 'Polycrystalline',
    serialNumber: 'SN987654321',
    recommendation: SolarPanelRecommendation.RECYCLE,
    solarPanelDamage: {
      hotSpots: false,
      microCracks: false,
      snailTrails: false,
      brokenGlass: false,
      additionalDetails: ''
    },
  },
  {
    createdAt: new Date('2023-03-20'),
    category: "Solar Panel",
    manufacturer: 'EcoEnergy',
    model: 'EE-1500',
    type: 'Thin-film',
    serialNumber: 'SN543216789',
    recommendation: SolarPanelRecommendation.DISPOSE,
    solarPanelDamage: {
      hotSpots: false,
      microCracks: false,
      snailTrails: false,
      brokenGlass: false,
      additionalDetails: ''
    },
  },
];

@Component({
  selector: 'app-solar-panel-history',
  templateUrl: './solar-panel-history.component.html',
  styleUrls: ['./solar-panel-history.component.css']
})
export class SolarPanelHistoryComponent implements OnInit, AfterViewInit {

  constructor(
    private dialog: MatDialog,
    private fb:FormBuilder
  ) { }

  solarPanels = new MatTableDataSource<Partial<GetSolarPanelFullResponse>>();

  displayedColumns: string[] = [
    "createdAt",
    "manufacturer",
    "model",
    "type",
    "serialNumber",
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

  ngAfterViewInit() {
    this.solarPanels.sort = this.sort;
  }

// *****************************************
// *** PAGINATOR and FILTERING
// *****************************************

  filterColumns: string[] = this.displayedColumns.map(column => column + "-filter");

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  recommendationOptions: SolarPanelRecommendation[] = Object.values(SolarPanelRecommendation);

  filterForm = this.fb.group({
    createdAt: null,
    manufacturer: null,

    serialNumber: null,
    model: null,
    type: null,

    recommendation: null
  });

  handleDate(value:string) {
    return (value == null)
      ? null
      : moment(this.filterForm.value.createdAt!).format("YYYY-MM-DD");
  }

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
    this.pageNumber = 0; // Return to the first page after clicking on filter
    this.loadPaginatedAndFiltered();
  }

  onReset() {
    // Test to see if i need to return to first page after reset
    this.loadPaginatedAndFiltered();
  }

  // 3. USE VALUES OF PAGINATOR TO REQUEST DATA
  loadPaginatedAndFiltered() {
    const searchSolarPanelRequest: SearchSolarPanelRequest = {
      pageIndex: this.pageNumber,
      pageSize: this.pageSize,

      manufacturer: this.filterForm.value.manufacturer || null,
      model: this.filterForm.value.model || null,
      type: this.filterForm.value.type || null,
      serialNumber: this.filterForm.value.serialNumber || null,

      recommendation: this.filterForm.value.recommendation || null,
      createdAt: this.handleDate(this.filterForm.value.createdAt!) 
    };

    console.log("searchSolarPanelRequest = ", searchSolarPanelRequest);

    // 4. UPDATE VALUES OF PAGINATOR FROM RESPONSE
    //TODO: API call to backend
    this.solarPanels.data = DUMMY_DATA;
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

  onView(solarPanel: GetSolarPanelFullResponse) {
    if(!solarPanel.solarPanelDamage) {
      //TODO: API call to get expanded, open dialog if successfull

      this.openDialog(solarPanel);      
      
    } else {
      this.openDialog(solarPanel);
    }    
  }

  openDialog(solarPanel: GetSolarPanelFullResponse) { 
    const dialogRef = this.dialog.open(SolarPanelHistoryViewComponent, {
      disableClose: true,
      width: '35%',
      data: { solarPanel: solarPanel },
      autoFocus: false
    });
  }
}
