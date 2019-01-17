import { Component, OnInit } from '@angular/core';
import { PageDescriptor } from 'projects/sbb-angular/src/public_api';
import { NavigationExtras } from '@angular/router';

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

  linkGenerator = (page: PageDescriptor): NavigationExtras & { routerLink: string | any[] } => {
    console.log('calling linkGenerator');
    return {
      routerLink: ['.'],
      queryParams: { page: page.index },
      queryParamsHandling: 'merge',
    };
  }

}
