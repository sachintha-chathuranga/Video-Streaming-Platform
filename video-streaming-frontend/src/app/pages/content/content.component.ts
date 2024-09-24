import { Component, AfterViewInit, ViewChild, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VideoFormComponent } from '../../components/video-form/video-form.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VideoDto } from '../../interfaces/video.dto';

@Component({
	selector: 'app-content',
	standalone: true,
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatTableModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatIconModule,
		CommonModule,
	],
	templateUrl: './content.component.html',
	styleUrl: './content.component.css',
})
export class ContentComponent implements AfterViewInit, OnInit {
	readonly dialog = inject(MatDialog);
	displayedColumns: string[] = [
		'select',
		'video',
		'visibility',
		// 'date',
		'views',
		'comments',
		'likes',
	];
	dataSource =new MatTableDataSource<VideoDto>();
	selection = new SelectionModel<VideoDto>(true, []);

	@ViewChild(MatPaginator)
	paginator!: MatPaginator;
	@ViewChild(MatSort)
	sort!: MatSort;
  constructor(private userService: UserService){

    this.userService.getUserVideos().subscribe({
      next: (data: VideoDto[]) => {
		  this.dataSource.data = data;
        console.log(data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      },
    });
  }
  ngOnInit(): void {
  }
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if(this.dataSource){
			this.dataSource.filter = filterValue.trim().toLowerCase();
		}
	}
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource?.data.length;
		return numSelected === numRows;
	}
	deleteSelected(): void {
		const selectedRows = this.selection.selected;
		// Remove selected rows from the data source
		if (this.dataSource) {
			this.dataSource.data = this.dataSource?.data.filter((row) => !this.selection.isSelected(row));
			this.selection.clear();
		}
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}
		if (this.dataSource) {
			
			this.selection.select(...this.dataSource.data);
		}
	}
	// /** The label for the checkbox on the passed row */
	// checkboxLabel(row?: PeriodicElement): string {
	//   if (!row) {
	//     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
	//   }
	//   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
	//     row.position + 1
	//   }`;
	// }

	ngAfterViewInit() {
		if (this.dataSource) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
	}
	openDialog() {
		const dialogRef = this.dialog.open(VideoFormComponent, {
			width: '80%',
			maxWidth: '900px',
			height: '590px',
			disableClose: true,
			data: {
				videoId: '1',
				videoUrl: '',
				thumbnailUrl: '',
				title: 'Video Title',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log(`Dialog result: ${result}`);
		});
	}
}


