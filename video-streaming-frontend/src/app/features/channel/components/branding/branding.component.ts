import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-branding',
	standalone: true,
	imports: [MatCardModule, MatButtonModule],
	templateUrl: './branding.component.html',
	styleUrl: './branding.component.css',
})
export class BrandingComponent {}
