import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wakeup',
  templateUrl: './wakeup.component.html',
  styleUrls: ['./wakeup.component.scss']
})
export class WakeupComponent implements OnInit {


  // TODO: Idea - Implement a component that will wakeup the backend services hosted on Azure.
  // Should retry 3-4 times. Should display a message when it failed. On success it should navigate to home.

  private apiURL = environment.apiBaseUrl;

  private serviceUrls = [
    // API for product
    `${this.apiURL}/api/v1/products/Washing Machine/manufacturers`,
    
    // API for washing-machine
    `${this.apiURL}/api/v1/washing-machines/someSerialNumber/validate`
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.warmupServices();
  }

  warmupServices() {
    // Simple promise-based warmup
    Promise.all(this.serviceUrls.map(url => 
      this.http.get(url).toPromise()
    ))
    .then(() => {
      // Navigate to home app once all services respond
      this.router.navigate(['/home']);
    })
    .catch(error => {
      console.error('Warmup failed', error);
      // Optionally handle failure (e.g., show error message)
    });
  }
}