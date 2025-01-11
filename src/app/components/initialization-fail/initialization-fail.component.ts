import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-initialization-fail',
    imports:[
        MatCardModule,
        MatButtonModule,
        RouterLink
    ],
    templateUrl: './initialization-fail.component.html',
    styleUrls: ['./initialization-fail.component.scss'],
})
export class InitializationFailComponent { }