import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, retry, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';
import { MatDialog } from '@angular/material/dialog';
import { InitializationSpinnerComponent } from '../shared/components/initialization-spinner/initialization-spinner.component';

@Injectable({ providedIn: 'root' })
export class InitializationService {

  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  async wakeupBackends(): Promise<void>  {

    const initializationSpinner = this.dialog.open(InitializationSpinnerComponent, {
      disableClose: true,
      panelClass: "initialization-dialog"
    });

    const [washingMachineAwake, productAwake] = await Promise.all([
      this.wakeupWashingMachine(),
      this.wakeupProduct()
    ]);

    // If one of the services fail, redirect to InitializationFailComponent
    if(!washingMachineAwake || !productAwake) {
      this.router.navigate(['/initialization-fail']);
    }

    initializationSpinner.close();
  }

  private async wakeupWashingMachine(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/v1/washing-machines/someSerialNumber/validate`, {
          context: new HttpContext().set(SKIP_INTERCEPTOR, true)
        }).pipe(
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
        this.http.get(`${this.apiUrl}/api/v1/products/Washing Machine/manufacturers`, {
          context: new HttpContext().set(SKIP_INTERCEPTOR, true)
        }).pipe(
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
