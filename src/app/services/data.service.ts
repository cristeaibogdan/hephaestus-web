import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAccountDTO } from '../components/models/dtos/user-account.dto';
import { UserUpdateContainer } from '../components/models/user-update-container.model';
import { Page } from '../components/models/page.model';
import { UserCredentialsDTO } from '../components/models/dtos/user-credentials.dto';
import { PageRequestDTO } from '../components/models/dtos/page-request.dto';
import { ProductModelTypeDTO } from '../components/models/dtos/product-model-type.dto';
import { OrganizationAndCountryDTO } from '../components/models/dtos/organization-and-country.dto';
import { WashingMachineEvaluationDTO } from '../components/models/dtos/washing-machine-evaluation.dto';
import { WashingMachineReportDTO } from '../components/models/dtos/washing-machine-report.dto';
import { WashingMachineDTO } from '../components/models/dtos/washing-machine.dto';
import { WashingMachineExpandedDTO } from '../components/models/dtos/washing-machine-expanded.dto';
import { WashingMachineDetailsDTO } from '../components/models/dtos/washing-machine-details.dto';

@Injectable({providedIn: 'root'})
export class DataService {
  apiURL = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

//**************************************
//*** STEP 1 = PRODUCT IDENTIFICATION
//**************************************

  getManufacturers(productCategory: string) {
    let url = this.apiURL.concat("/api/v1/products/")
      .concat(productCategory)
      .concat("/manufacturers");
    
    return this.http.get<string[]>(url);
  }
  
  getModelsAndTypes(productManufacturer: string) {
    const url = this.apiURL.concat("/api/v1/products/")
      .concat(productManufacturer)
      .concat("/models-and-types");

    return this.http.get<ProductModelTypeDTO[]>(url);
  }

//**************************************
//*** STEP 3 = OVERVIEW
//**************************************
  
  getDamageEvaluation(washingMachineDetails:WashingMachineDetailsDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines/evaluate");
    return this.http.post<WashingMachineEvaluationDTO>(url, washingMachineDetails);
  }

//**************************************
//*** STEP 4 = RECOMMENDED DECISION
//**************************************

  save(washingMachine:FormData) {
    const url = this.apiURL.concat("/api/v1/washing-machines/save");
    return this.http.post(url, washingMachine);
  }

  getReport(serialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(serialNumber)
      .concat("/report");

    return this.http.get<WashingMachineReportDTO>(url);
  }

//**************************************
//*** HISTORY
//**************************************

  loadPaginatedAndFiltered(pageRequestDTO:PageRequestDTO) {
    const url = this.apiURL.concat("/api/v1/washing-machines");
    const payload = pageRequestDTO;
    return this.http.post<Page<WashingMachineDTO>>(url, payload);
  }

  loadExpanded(productSerialNumber:string) {
    const url = this.apiURL.concat("/api/v1/washing-machines/")
      .concat(productSerialNumber)
      .concat("/expanded");

    return this.http.get<WashingMachineExpandedDTO>(url);
  }

//******************************
//*** AUTH - REGISTER
//******************************

  register(userAccountDTO:UserAccountDTO) {
    const url = this.apiURL.concat("/api/v1/users/register");
    const payload = userAccountDTO;

    return this.http
      .post<void>(url, payload);
  }

  getOrganizationAndCountry(registerCode: string) {
    const url = this.apiURL.concat("/api/v1/users/")
      .concat(registerCode)
      .concat("/organization-and-country");

    // Header so interceptor ignores it
    const headers = new HttpHeaders().set('AsyncValidator', 'true');

    return this.http
      .get<OrganizationAndCountryDTO>(url, {headers});
  }

//******************************
//*** AUTH - LOGIN
//******************************

  login(userCredentialDTO: UserCredentialsDTO) {
    const url = this.apiURL.concat("/api/v1/users/login");
    const payload = userCredentialDTO;
    return this.http
      .post<UserAccountDTO>(url, payload);
  }

//*****************************
//*** USER PROFILE => To be implemented
//*****************************

  updateUserAccount(userUpdateContainer:UserUpdateContainer) {
    const url = this.apiURL.concat("/auth/update");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

  updateUserAccountPassword(userUpdateContainer:UserUpdateContainer) {
    const url = this.apiURL.concat("/auth/password");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

//****************************
//*** SNACKBAR NOTIFICATIONS
//****************************

  openSnackBar_Error(errorMessage:string, displayDuration:number) {
    this._snackBar.open(errorMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-error'
    });
  }

  openSnackBar_Success(successMessage:string, displayDuration:number) {
    this._snackBar.open(successMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-success'
    });
  }

  openSnackBar_Warning(successMessage:string, displayDuration:number) {
    this._snackBar.open(successMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-warning'
    });
  }

//****************************
//*** BYTE64 CONVERTOR
//****************************

  base64ToArrayBuffer(base64:string):ArrayBuffer {
    const binary_string = atob(base64);
    const bytes = Uint8Array.from(binary_string, char => char.charCodeAt(0));
    return bytes.buffer;
  }

}

