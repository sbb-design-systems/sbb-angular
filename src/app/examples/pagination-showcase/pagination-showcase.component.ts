import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  styleUrls: ['./pagination-showcase.component.scss']
})
export class PaginationShowcaseComponent {

  maxPage = 5;
  initialPage = 1;

  onPageChange($event) {
    console.log($event);
  }

}
