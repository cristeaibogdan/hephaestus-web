import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full.response';
import { MatSort } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { FormBuilder } from '@angular/forms';
import { SearchSolarPanelRequest } from '../../models/dtos/search-solar-panel.request';
import { SolarPanelHistoryViewComponent } from './solar-panel-history-view/solar-panel-history-view.component';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


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
      hotSpots: true,
      microCracks: false,
      snailTrails: true,
      brokenGlass: false,
      additionalDetails: 'Half properties true'
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
      hotSpots: true,
      microCracks: true,
      snailTrails: true,
      brokenGlass: true,
      additionalDetails: 'All properties true'
    },
  },
];

@Component({
  selector: 'app-solar-panel-history',
  templateUrl: './solar-panel-history.component.html',
  styleUrls: ['./solar-panel-history.component.scss']
})
export class SolarPanelHistoryComponent implements OnInit, AfterViewInit {

  readonly solarPanelRecommendation = SolarPanelRecommendation;

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
    createdAt: null as string | null,
    manufacturer: null as string | null,
    
    serialNumber: null as string | null,
    model: null as string | null,
    type: null as string | null,

    recommendation: null as SolarPanelRecommendation | null
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

      manufacturer: this.filterForm.controls.manufacturer.value,
      model: this.filterForm.controls.model.value,
      type: this.filterForm.controls.type.value,
      serialNumber: this.filterForm.controls.serialNumber.value,

      recommendation: this.filterForm.controls.recommendation.value,
      createdAt: this.handleDate(this.filterForm.controls.createdAt.value) 
    };

    console.log("searchSolarPanelRequest = ", searchSolarPanelRequest);

    // 4. UPDATE VALUES OF PAGINATOR FROM RESPONSE
    //TODO: API call to backend
    this.solarPanels.data = DUMMY_DATA;
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
    this.dialog.open(SolarPanelHistoryViewComponent, {
      disableClose: true,
      width: '35%',
      data: { solarPanel: solarPanel },
      autoFocus: false
    });
  }
}
