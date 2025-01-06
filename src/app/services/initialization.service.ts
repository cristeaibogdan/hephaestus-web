import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InitializationService {

  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  async wakeupBackend(): Promise<void>  {

    let washingMachineAwake = false;
    let productAwake = false;
    
    try { // First request to wakeup washing-machine service
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/v1/washing-machines/someSerialNumber/validate`)
      );
      washingMachineAwake = true;
    } catch (err) {
      console.warn('Washing Machine wake-up call failed:', err);
    }
    
    try { // Second request to wakeup washing-machine service
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/v1/products/Washing Machine/manufacturers`)
      );
      productAwake = true;
    } catch (err) {
      console.warn('Product wake-up call failed:', err);
    }

    // If both services fail, the user will be redirected to InitializationFailComponent
    if(!washingMachineAwake && !productAwake) {
      this.router.navigate(['/initialization-fail']);
    }
  }
}
