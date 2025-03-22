import { AfterViewInit, Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full.response';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SearchSolarPanelRequest } from '../../models/dtos/search-solar-panel.request';
import { SolarPanelHistoryViewComponent } from './solar-panel-history-view/solar-panel-history-view.component';
import { format } from 'date-fns';
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
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { NotificationService } from 'src/app/services/notification.service';

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
  styleUrls: ['./solar-panel-history.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
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
export class SolarPanelHistoryComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private _solarPanelDataService = inject(SolarPanelDataService);
  private _translocoService = inject(TranslocoService);
  private _notifService = inject(NotificationService);

  readonly solarPanelRecommendation = SolarPanelRecommendation;

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
    this._solarPanelDataService.loadPaginatedAndFiltered(searchSolarPanelRequest).subscribe({
      next: response => {
        console.log("Response = ", response);

        if(response.content.length == 0) {
          this._notifService.showWarning(this._translocoService.translate("I18N.GENERAL_ERROR.EMPTY_PAGE"), 0);
        }

        this.solarPanels.data = response.content;
        this.pageNumber = response.number;
        this.pageSize = response.size;
        this.totalElements = response.totalElements;
      },
      error: err => {
        this.solarPanels.data = [];
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
