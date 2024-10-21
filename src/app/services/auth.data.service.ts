import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserAccountDTO } from '../washing-machine/models/dtos/user-account.dto';
import { LoginUserRequest } from '../washing-machine/models/dtos/login-user-request.dto';
import { UserUpdateContainer } from '../washing-machine/models/dtos/user-update-container.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetOrganizationAndCountryResponse } from '../washing-machine/models/dtos/get-organization-and-country-response.dto';
import { CreateUserRequest } from '../washing-machine/models/dtos/create-user-request.dto';

@Injectable({providedIn: 'root'})
export class AuthDataService {
  apiURL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

//******************************
//*** AUTH - LOGIN
//******************************

  login(loginUserRequest: LoginUserRequest) {
    const url = this.apiURL.concat("/api/v1/users/login");
    const payload = loginUserRequest;
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

//******************************
//*** AUTH - REGISTER
//******************************

  register(createUserRequest: CreateUserRequest) {
    const url = this.apiURL.concat("/api/v1/users/register");
    const payload = createUserRequest;

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
      .get<GetOrganizationAndCountryResponse>(url, {headers});
  }
}
