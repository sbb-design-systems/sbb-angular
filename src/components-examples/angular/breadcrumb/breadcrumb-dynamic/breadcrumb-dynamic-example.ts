import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

interface Group {
  items: GroupItem[];
}

interface GroupItem {
  title: string;
  path: string;
  active?: boolean;
}

/**
 * @title Breadcrumb Dynamic
 * @order 30
 */
@Component({
  selector: 'sbb-breadcrumb-dynamic-example',
  templateUrl: 'breadcrumb-dynamic-example.html',
  imports: [SbbBreadcrumbModule, RouterLink, SbbMenuModule, RouterLinkActive],
})
export class BreadcrumbDynamicExample {
  // This example should not be used as is. Router Config should be
  // considered instead of creating own groups.
  groups: Group[] = [
    {
      items: [
        {
          title: 'Timetable',
          path: 'timetable',
        },
        {
          title: 'Travelcards & tickets',
          path: 'travelcards-and-tickets',
        },
        {
          title: 'Station & services',
          path: 'station-services',
          active: true,
        },
        {
          title: 'Business customers',
          path: 'business-customers',
        },
        {
          title: 'Leisure & holidays',
          path: 'leisure-holidays',
        },
      ],
    },
    {
      items: [
        {
          title: 'Before your journey',
          path: 'before-your-journey',
        },
        {
          title: 'During your journey',
          path: 'during-your-journey',
        },
        {
          title: 'After your journey',
          path: 'after-your-journey',
        },
        {
          title: 'At the station',
          path: 'at-the-station',
          active: true,
        },
      ],
    },
    {
      items: [
        {
          title: 'Our rail stations',
          path: 'railway-stations',
        },
        {
          title: 'Services at the station',
          path: 'services-at-the-station',
        },
        {
          title: 'Services from the ticket machine',
          path: 'services-from-the-ticket-machine',
        },
        {
          title: 'Parking at the station',
          path: 'parking-station',
        },
        {
          title: 'Getting to and from the station',
          path: 'getting-to-and-from-the-station',
          active: true,
        },
      ],
    },
    {
      items: [
        {
          title: 'Sharing services',
          path: 'sharing',
          active: true,
        },
        {
          title: 'Rental bike',
          path: 'rental-bike',
        },
        {
          title: 'Taxi',
          path: 'taxi',
        },
        {
          title: 'Pilot projects',
          path: 'pilot-projects',
        },
      ],
    },
    {
      items: [
        {
          title: 'Car sharing',
          path: 'mobility',
        },
        {
          title: 'Bike sharing',
          path: 'bikesharing',
          active: true,
        },
      ],
    },
  ];

  groupTitle(group: Group) {
    return group.items.find((item) => item.active)!.title;
  }

  composeHref(group: Group, path: string): string {
    const groupIndex = this.groups.indexOf(group);
    return `./${[
      ...this.groups
        .slice(0, groupIndex)
        .map((groupEntry) => groupEntry.items.find((groupItem) => groupItem.active)!.path),
      path,
    ].join('/')}`;
  }
}
