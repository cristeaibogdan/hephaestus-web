import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, retry, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InitializationService {

  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  async wakeupBackends(): Promise<void>  {
    const [washingMachineAwake, productAwake] = await Promise.all([
      this.wakeupWashingMachine(),
      this.wakeupProduct()
    ]);

    // If one of services fail, the user will be redirected to InitializationFailComponent
    if(!washingMachineAwake || !productAwake) {
      this.router.navigate(['/initialization-fail']);
    }
  }

  private async wakeupWashingMachine(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/v1/washing-machines/someSerialNumber/validate`).pipe(
          retry({
            count: 3,
            delay: (error, count) => {
              console.warn(`Washing Machine retry attempt ${count}/3`, error);
              return timer(0);
            }
          })
        )
      );
      return true;
    } catch (err) {
      console.warn('Washing Machine wake-up call failed:', err);
      return false;
    }
  }

  private async wakeupProduct(): Promise<boolean> {
    try { 
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/v1/products/Washing Machine/manufacturers`).pipe(
          retry({
            count: 3,
            delay: (error, count) => {
              console.warn(`Product retry attempt ${count}/3`, error);
              return timer(0);
            }
          })
        )
      );
      return true;
    } catch (err) {
      console.warn('Product wake-up call failed:', err);
      return false;
    }
  }
}
