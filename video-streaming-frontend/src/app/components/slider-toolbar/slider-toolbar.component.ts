import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChannelCardComponent } from '../channel-card/channel-card.component';

@Component({
  selector: 'slider-toolbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ChannelCardComponent],
  templateUrl: './slider-toolbar.component.html',
  styleUrl: './slider-toolbar.component.css',
})
export class SliderToolbarComponent {
  @Input()
  mode!: string;

  @Input()
  isWindowView!: boolean;

  @ViewChild('scrollableContent', { read: ElementRef })
  scrollableContent!: ElementRef;
  activeButtonIndex: number = 0;
  leftButton: boolean = false;
  rightButton: boolean = true;
  categories = [
    'All',
    'Music',
    'Live',
    'Entertaitment',
    'Funny',
    'Movies',
    'TV Series',
    'All',
    'Music',
    'Live',
    'Entertaitment',
    'Funny',
    'Movies',
    'TV Series',
  ];

  scrollTo(isRight: boolean) {
    const scrollPoints = isRight ? 300 : -300;
    const element = this.scrollableContent.nativeElement;
    const scrollLeft = element.scrollLeft + scrollPoints; // Current scroll position from the top
    const scrollWidth = element.scrollWidth; // Total height of the scrollable content
    const clientWidth = element.clientWidth; // Height of the visible content

    element.scrollBy({
      left: scrollPoints,
      behavior: 'smooth',
    });
    if (scrollLeft <= 0 && this.leftButton) {
      this.leftButton = false;
    } else if (!this.leftButton) {
      this.leftButton = true;
    }
    if (scrollLeft + clientWidth >= scrollWidth && this.rightButton) {
      this.rightButton = false;
    } else if (!this.rightButton) {
      this.rightButton = true;
    }
  }
  
  filterList(category: string, index: number) {
    this.activeButtonIndex = index;
    console.log(category);
  }
}
