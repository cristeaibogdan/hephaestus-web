import {Directive, HostBinding} from "@angular/core";

@Directive({
  selector:'[stepper-buttons]'})
  export class StepperButtonsDirective {

    @HostBinding('style.display') display:string = 'flex';
    @HostBinding('style.justify-content') justify:string = 'center';
    @HostBinding('style.gap') gap:string = '5%';
    @HostBinding('style.margin') margin:string = '1.5% 0';
  }

