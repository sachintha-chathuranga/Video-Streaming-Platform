import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCustomizationComponent } from './profile-customization.component';

describe('ChannelCustomizationComponent', () => {
	let component: ChannelCustomizationComponent;
	let fixture: ComponentFixture<ChannelCustomizationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ChannelCustomizationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ChannelCustomizationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
