import { Component, OnDestroy } from '@angular/core';
import { GhettoboxService, } from 'projects/sbb-angular/src/lib/ghettobox/ghettobox';
import { ActivatedRoute } from '@angular/router';
import { LinkGeneratorResult } from 'sbb-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-ghettobox-showcase',
  templateUrl: './ghettobox-showcase.component.html',
  styleUrls: ['./ghettobox-showcase.component.scss']
})
export class GhettoboxShowcaseComponent implements OnDestroy {

  private _ghettoboxInitLoadSubscription = Subscription.EMPTY;

  constructor(private _ghettoboxService: GhettoboxService, private route: ActivatedRoute) {
    this._ghettoboxInitLoadSubscription =
      this._ghettoboxService.ready.subscribe(
        () => this._ghettoboxService.add({ message: 'This ghettobox is loaded at page load', link: this.linkGenerator(getRandomInt(10)) })
      );
  }

  ngOnDestroy() {
    this._ghettoboxInitLoadSubscription.unsubscribe();
  }

  linkGenerator = (randomParam: number): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { test: randomParam },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }

  addGhettoboxes() {
    this._ghettoboxService.add(
      [
        { message: 'Hello ghettobox', link: this.linkGenerator(getRandomInt(10)) },
        { message: 'Hello ghettobox 2', link: this.linkGenerator(getRandomInt(10)) }
      ]
    );
  }

  deleteById(id: string) {
    const deleted = this._ghettoboxService.deleteById(id);
    console.log(deleted);
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
