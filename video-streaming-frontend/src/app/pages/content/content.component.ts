import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
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
    CommonModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  constructor() {}
  displayedColumns: string[] = [
    'select',
    'video',
    'visibility',
    'date',
    'views',
    'comments',
    'likes',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  deleteSelected(): void {
    const selectedRows = this.selection.selected;
    // Remove selected rows from the data source
    this.dataSource.data = this.dataSource.data.filter(
      (row) => !this.selection.isSelected(row)
    );
    this.selection.clear();
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

export interface PeriodicElement {
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 1,
    comments: 1,
    likes: 1,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 4,
    comments: 4,
    likes: 4,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 4,
    comments: 4,
    likes: 4,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 47,
    comments: 47,
    likes: 47,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 74,
    comments: 74,
    likes: 74,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 47,
    comments: 47,
    likes: 47,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 4,
    comments: 4,
    likes: 4,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 1,
    comments: 1,
    likes: 1,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 4,
    comments: 4,
    likes: 4,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 74,
    comments: 74,
    likes: 74,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 84,
    comments: 84,
    likes: 84,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 58,
    comments: 58,
    likes: 58,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 14,
    comments: 14,
    likes: 14,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 25,
    comments: 25,
    likes: 25,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 36,
    comments: 36,
    likes: 36,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 69,
    comments: 69,
    likes: 69,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 95,
    comments: 95,
    likes: 95,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 8,
    comments: 8,
    likes: 8,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series | Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 2,
    comments: 2,
    likes: 2,
  },
  {
    title: 'How to Create Youtube video | ForBitLk',
    description:
      'Master Linux Commands Series Episode 2: Find, Grep,  More Welcome back to FourBit LK! In this action-packed episode ofour Linux Command Series, we dive deep into essential commandsevery Linux enthusiast should know.',
    thumbnailUrl: 'roundUp.png',
    visibility: 'Public',
    date: 'Apr 1, 2024',
    views: 8,
    comments: 8,
    likes: 8,
  },
];
