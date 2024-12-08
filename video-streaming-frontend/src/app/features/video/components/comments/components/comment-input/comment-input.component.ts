import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-comment-input',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		ReactiveFormsModule,
		MatButtonModule,
	],
	templateUrl: './comment-input.component.html',
	styleUrl: './comment-input.component.css',
})
export class CommentInputComponent {
	@Input()
	submitName!: string;
	@Input()
	defaltInputValue!: string;
	@Input()
	autofocus!: boolean;
	comment: FormControl;
	commentsForm: FormGroup;
	isFocus: boolean = false;
	@Output()
	onSubmit = new EventEmitter<string>();
	@Output()
	cancel = new EventEmitter<string>();

	@ViewChild('inputElement')
	inputElement!: ElementRef;

	constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {
		this.commentsForm = this.fb.group({
			comment: [this.defaltInputValue],
		});
		this.comment = this.commentsForm.get('comment') as FormControl;
	}

	ngOnInit() {
		this.comment.setValue(this.defaltInputValue);
		console.log('Comment Input On Init');
	}
	ngAfterViewInit() {
		if (this.inputElement && this.autofocus) {
			this.onFocus();
			this.cdr.detectChanges();
			this.inputElement.nativeElement.focus();
		}
		console.log('Comment Input After View');
	}
	handleSubmit() {
		this.onSubmit.emit(this.comment.value);
		this.onCancel();
	}
	onFocus() {
		this.isFocus = true;
	}

	onCancel() {
		this.isFocus = false;
		this.comment.reset();
		this.cancel.emit();
	}
	autoGrow(event: Event): void {
		const textArea = event.target as HTMLTextAreaElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
}
