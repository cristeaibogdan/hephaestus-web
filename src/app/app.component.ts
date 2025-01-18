import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent
  ]
})
export class AppComponent {
  private router = inject( Router,);
  private sanitizer = inject(DomSanitizer,);
  private matIconRegistry = inject(MatIconRegistry);

  showHeader: boolean = true;
  
  constructor() {
  // used to hide the header on login and register page 
  this.router.events.forEach((event) => {

    if (event instanceof NavigationStart) {
      const currentUrl = event.url;
      
      if (currentUrl === '/login' || currentUrl === '/register') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    }
  });

  this.matIconRegistry
    .addSvgIcon("profile",this.sanitizer.bypassSecurityTrustResourceUrl("assets/svgs/profile.svg"))
    .addSvgIcon("search",this.sanitizer.bypassSecurityTrustResourceUrl("assets/svgs/search.svg"))
    .addSvgIcon('camera_ON', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/camera_ON.svg'))
    .addSvgIcon('camera_OFF', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/camera_OFF.svg'))
    .addSvgIcon('camera_SWITCH', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/camera_SWITCH.svg'))
    .addSvgIcon('help', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/help.svg'))
    .addSvgIcon('upload', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/upload.svg'))
    // .addSvgIcon('close', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/close.svg'));    
  }  
}
