import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { GhettoboxService, GhettoboxRef, } from 'projects/sbb-angular/src/lib/ghettobox/ghettobox';
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

  @ViewChild('testIcon1', { read: TemplateRef }) testIcon1: TemplateRef<any>;
  @ViewChild('testIcon2', { read: TemplateRef }) testIcon2: TemplateRef<any>;

  constructor(private _ghettoboxService: GhettoboxService, private route: ActivatedRoute) {
    this._ghettoboxInitLoadSubscription =
      this._ghettoboxService.ready.subscribe(
        () => {
          this._ghettoboxService.add(
            { message: 'This ghettobox is loaded at page load', link: this.linkGenerator(getRandomInt(10)), icon: this.testIcon1 });
        }
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

  addGhettobox() {
    this._ghettoboxService.add({ message: 'Hello ghettobox', link: this.linkGenerator(getRandomInt(10)), icon: this.testIcon2 });
  }

  deleteById(id: string) {
    const deleted = this._ghettoboxService.deleteById(id);
    console.log(deleted);
  }

  deleteByIndex(index: number) {
    const deleted = this._ghettoboxService.deleteByIndex(index);
    console.log(deleted);
  }

  clear() {
    this._ghettoboxService.clearAll();
  }

  printAttachedGhettoboxesIDS() {
    return this._ghettoboxService.attachedGhettoboxes.map(
      g => {
        return {
          id: g.id
        };
      }
    );
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
