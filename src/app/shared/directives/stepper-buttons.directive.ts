import {Directive} from "@angular/core";

@Directive({
    selector: '[stepper-buttons]',
    host: {
        '[style.display]': `'flex'`,
        '[style.justify-content]': `'center'`,
        '[style.gap]': `'5%'`,
        '[style.margin]': `'1.5% 0'`
    },
    standalone: false
})
  export class StepperButtonsDirective {}

