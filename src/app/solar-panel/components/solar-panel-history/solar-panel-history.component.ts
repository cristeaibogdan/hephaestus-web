import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full-response.dto';
import { MatSort } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';


const DUMMY_DATA: GetSolarPanelFullResponse[] = [
  {
    createdAt: new Date('2022-01-01'),
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
    private fb:FormBuilder
  ) { }

  solarPanels = new MatTableDataSource<Partial<GetSolarPanelFullResponse>>(DUMMY_DATA);

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
    console.log("Initialized!");
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

  // 1. STARTING VALUES FOR PAGINATOR
  pageNumber = 0;
  pageSize = 10;

  totalElements = 0;
  pageSizeOptions = [2, 5, 10, 20, 40];
  
}
