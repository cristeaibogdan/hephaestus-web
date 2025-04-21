import { AfterViewInit, Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full.response';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SearchSolarPanelRequest } from '../../models/dtos/search-solar-panel.request';
import { SolarPanelHistoryViewComponent } from './solar-panel-history-view/solar-panel-history-view.component';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DateFormatYYYYMMDDDirective } from 'src/app/shared/directives/date-format-yyyy-mm-dd.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { SolarPanelDataSource } from './solar-panel-datasource';

@Component({
  selector: 'app-solar-panel-history',
  templateUrl: './solar-panel-history.component.html',
  styleUrls: ['./solar-panel-history.component.scss'],
  providers: [SolarPanelDataSource],
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
export class SolarPanelHistoryComponent implements AfterViewInit {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  solarPanelRecommendation = SolarPanelRecommendation;
  dataSource: SolarPanelDataSource = inject(SolarPanelDataSource);

  displayedColumns: string[] = [
    "createdAt",
    "manufacturer",
    "model",
    "type",
    "serialNumber",
    "recommendation",
    "actions"
  ]; 

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // 1. SET PAGINATOR AND SORT TO DATA SOURCE
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applySearchFilters();
  }

// *****************************************
// *** PAGINATOR and FILTERING
// *****************************************

  filterColumns: string[] = this.displayedColumns.map(column => column + "-filter");

  recommendationOptions: SolarPanelRecommendation[] = Object.values(SolarPanelRecommendation);

  filterForm = this.fb.group({
    createdAt: null as string | null,
    manufacturer: null as string | null,
    serialNumber: null as string | null,
    model: null as string | null,
    type: null as string | null,
    recommendation: null as SolarPanelRecommendation | null
  });

  onFilter() {
    this.dataSource.paginator.firstPage();
    this.applySearchFilters();
  }

  onReset() {
    this.dataSource.paginator.firstPage();
    this.applySearchFilters();
  }

  // 2. USE VALUES OF FORM AND PAGINATOR TO REQUEST DATA
  applySearchFilters() {
    const searchSolarPanelRequest: SearchSolarPanelRequest = {
      pageIndex: this.dataSource.paginator.pageIndex,
      pageSize: this.dataSource.paginator.pageSize,

      manufacturer: this.filterForm.controls.manufacturer.value,
      model: this.filterForm.controls.model.value,
      type: this.filterForm.controls.type.value,
      serialNumber: this.filterForm.controls.serialNumber.value,

      recommendation: this.filterForm.controls.recommendation.value,
      createdAt: this.handleDate(this.filterForm.controls.createdAt.value) 
    };

    // 3. SEARCH SOLARPANELS AND UPDATE PAGINATOR FROM RESPONSE
    this.dataSource.search(searchSolarPanelRequest);
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
