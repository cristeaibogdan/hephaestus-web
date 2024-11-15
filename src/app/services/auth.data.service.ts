import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginUserResponse } from '../washing-machine/models/dtos/login-user.response';
import { LoginUserRequest } from '../washing-machine/models/dtos/login-user.request';
import { UserUpdateContainer } from '../washing-machine/models/user-update-container.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GetOrganizationAndCountryResponse } from '../washing-machine/models/dtos/get-organization-and-country.response';
import { CreateUserRequest } from '../washing-machine/models/dtos/create-user.request';
import { Observable } from 'rxjs';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';

@Injectable({providedIn: 'root'})
export class AuthDataService {
  apiURL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

//******************************
//*** AUTH - LOGIN
//******************************

  login(loginUserRequest: LoginUserRequest): Observable<LoginUserResponse> {
    const url = this.apiURL.concat("/api/v1/users/login");
    const payload = loginUserRequest;
    return this.http
      .post<LoginUserResponse>(url, payload);
  }

//*****************************
//*** USER PROFILE => To be implemented
//*****************************

  updateUserAccount(userUpdateContainer:UserUpdateContainer): Observable<any> {
    const url = this.apiURL.concat("/auth/update");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

  updateUserAccountPassword(userUpdateContainer:UserUpdateContainer): Observable<any> {
    const url = this.apiURL.concat("/auth/password");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

//******************************
//*** AUTH - REGISTER
//******************************

  register(createUserRequest: CreateUserRequest): Observable<void> {
    const url = this.apiURL.concat("/api/v1/users/register");
    const payload = createUserRequest;

    return this.http
      .post<void>(url, payload);
  }

  getOrganizationAndCountry(registerCode: string): Observable<GetOrganizationAndCountryResponse> {
    const url = this.apiURL.concat("/api/v1/users/")
      .concat(registerCode)
      .concat("/organization-and-country");

    // Context so interceptor ignores it
    const context = new HttpContext().set(SKIP_INTERCEPTOR, true);

    return this.http
      .get<GetOrganizationAndCountryResponse>(url, {context});
  }
}
