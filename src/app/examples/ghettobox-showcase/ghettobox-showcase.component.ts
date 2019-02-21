import { Component } from '@angular/core';
import { GhettoboxService, } from 'projects/sbb-angular/src/lib/ghettobox/ghettobox';
import { ActivatedRoute } from '@angular/router';
import { LinkGeneratorResult } from 'sbb-angular';

@Component({
  selector: 'sbb-ghettobox-showcase',
  templateUrl: './ghettobox-showcase.component.html',
  styleUrls: ['./ghettobox-showcase.component.scss']
})
export class GhettoboxShowcaseComponent {

  constructor(private _ghettoboxService: GhettoboxService, private route: ActivatedRoute) { }

  linkGenerator = (randomParam: number): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { test: randomParam },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }

  addGhettobox() {
    this._ghettoboxService.add({ message: 'Hello ghettobox', link: this.linkGenerator(getRandomInt(10)) });
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
