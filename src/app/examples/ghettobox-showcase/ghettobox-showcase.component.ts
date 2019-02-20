import { Component, OnInit } from '@angular/core';
import { GhettoboxService } from 'projects/sbb-angular/src/lib/ghettobox/ghettobox';
import { ActivatedRoute } from '@angular/router';
import { LinkGeneratorResult } from 'sbb-angular';

@Component({
  selector: 'sbb-ghettobox-showcase',
  templateUrl: './ghettobox-showcase.component.html',
  styleUrls: ['./ghettobox-showcase.component.scss']
})
export class GhettoboxShowcaseComponent implements OnInit {

  constructor(private _ghettoboxService: GhettoboxService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  linkGenerator = (test: string): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { test: test },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }

  addGhettobox() {
    this._ghettoboxService.add({ message: 'Hello ghettobox', link: this.linkGenerator('test') });
  }
}
