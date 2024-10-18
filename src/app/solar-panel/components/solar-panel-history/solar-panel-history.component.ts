import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full-response.dto';
import { MatSort } from '@angular/material/sort';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';


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
}
