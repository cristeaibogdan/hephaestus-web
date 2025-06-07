import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, firstValueFrom, retry, takeUntil, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SKIP_INTERCEPTOR } from '../shared/validators/async-validators/skip-interceptor.token';
import { MatDialog } from '@angular/material/dialog';
import { InitializationSpinnerComponent } from '../components/initialization-spinner/initialization-spinner.component';

@Injectable({ providedIn: 'root' })
export class InitializationService {

  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private cancel$ = new Subject<void>();

  async wakeupBackends(): Promise<void>  {

    const initializationSpinner = this.dialog.open(InitializationSpinnerComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: "initialization-dialog",
      data: { onCancel: () => this.cancel() }
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

  cancel(): void {
    console.warn('Initialization aborted by user.');
    this.cancel$.next();
    this.cancel$.complete();
  }

  private async wakeupWashingMachine(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.apiUrl}/v1/washing-machines/someSerialNumber/validate`, {
          context: new HttpContext().set(SKIP_INTERCEPTOR, true),
        }).pipe(
          retry({
            count: 3,
            delay: (error, count) => {
              console.warn(`Washing Machine retry attempt ${count}/3`, error);
              return timer(1000);
            }
          }),
          takeUntil(this.cancel$),
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
        this.http.get(`${this.apiUrl}/v1/products/Washing Machine/manufacturers`, {
          context: new HttpContext().set(SKIP_INTERCEPTOR, true)
        }).pipe(
          retry({
            count: 3,
            delay: (error, count) => {
              console.warn(`Product retry attempt ${count}/3`, error);
              return timer(1000);
            }
          }),
          takeUntil(this.cancel$),
        )
      );
      return true;
    } catch (err) {
      console.warn('Product wake-up call failed:', err);
      return false;
    }
  }
}
