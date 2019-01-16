import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-pagination-showcase',
  templateUrl: './pagination-showcase.component.html',
  styleUrls: ['./pagination-showcase.component.scss']
})
export class PaginationShowcaseComponent {

  onPageChange($event) {
    console.log($event);
  }

}
