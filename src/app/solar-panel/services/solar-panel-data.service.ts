import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateSolarPanelRequest } from '../models/dtos/create-solar-panel-request.dto';
import { GetModelAndTypeResponse } from 'src/app/shared/models/get-model-and-type-response.dto';

@Injectable({providedIn: 'root'})
export class SolarPanelDataService { //TODO: replace with proper backend api calls
  apiURL = environment.apiBaseUrl;

  constructor() { }

//**************************************
//*** STEP 1 = IDENTIFICATION
//**************************************

  getManufacturers(category: string) {
    return ["Tesla", "Tongwei", "Qcells", "Bloom Energy"];
  }

  getModelsAndTypes(manufacturer: string) {
    const teslaModelsAndTypes: GetModelAndTypeResponse[] = [
      {
        model: 'Solar Edge 420',
        type: 'TSE-420-8A7C12'
      },
      {
        model: 'PowerMax 500',
        type: 'TPM-500-2B9D35'
      },
      {
        model: 'Energy Pro 300',
        type: 'TEP-300-4D6E27'
      },
      {
        model: 'Photon Prime 600',
        type: 'TPP-600-5F8A11'
      },
      {
        model: 'VoltWave 375',
        type: 'TVW-375-3C9B47'
      }
    ];

    const tongweiModelsAndTypes: GetModelAndTypeResponse[] = [
      {
        model: 'AquaCell 350',
        type: 'TWAC-350-7E5G31'
      },
      {
        model: 'SunCore 400',
        type: 'TWSC-400-9B1D22'
      },
      {
        model: 'SolarMax 450',
        type: 'TWSM-450-3C4F16'
      },
      {
        model: 'Photon Elite 500',
        type: 'TWPE-500-2A7H54'
      },
      {
        model: 'Horizon 325',
        type: 'TWH-325-4G8D29'
      }
    ];

    const qcellsModelsAndTypes: GetModelAndTypeResponse[] = [
      {
        model: 'PowerFlex 275',
        type: 'QCPF-275-5B3F90'
      },
      {
        model: 'UltraVolt 500',
        type: 'QCUV-500-8D7E13'
      },
      {
        model: 'SolarX 350',
        type: 'QCSX-350-1A9H42'
      },
      {
        model: 'PhotonMax 425',
        type: 'QCPM-425-6E5C67'
      },
      {
        model: 'EcoBright 300',
        type: 'QCEB-300-7G2F81'
      }
    ];
    
    const bloomEnergyModelsAndTypes: GetModelAndTypeResponse[] = [
      {
        model: 'Solara 400',
        type: 'BES-400-9C8G12'
      },
      {
        model: 'PowerCell 500',
        type: 'BEPC-500-6A3D23'
      },
      {
        model: 'PhotonEdge 450',
        type: 'BEPE-450-2E5F91'
      },
      {
        model: 'SolarMax 300',
        type: 'BESM-300-7D1C37'
      },
      {
        model: 'SunWave 600',
        type: 'BESW-600-4B8H44'
      }
    ];
    
    switch(manufacturer) {
      case "Tesla":
        return teslaModelsAndTypes;
      case "Tongwei":
        return tongweiModelsAndTypes;
      case "Qcells":
        return qcellsModelsAndTypes;
      case "Bloom Energy":
        return bloomEnergyModelsAndTypes; 
    }

    return null;
  }

// **************************************
// *** STEP 3 = OVERVIEW
// **************************************

  save(createSolarPanelRequestDTO: CreateSolarPanelRequest) {
    console.log("Saving ...", createSolarPanelRequestDTO);
  }

  getRecommendation(serialNumber: string) {
    console.log("Getting ... recommendation");
  }

// **************************************
// *** STEP 4 = RECOMMENDATION
// **************************************

  getReport(serialNumber:string) {
    console.warn("Not implemented, yet...");
  }
}
