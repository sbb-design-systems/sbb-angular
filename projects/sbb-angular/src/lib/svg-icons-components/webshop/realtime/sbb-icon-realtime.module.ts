import { NgModule } from '@angular/core';
import { IconRealtimeAddStopComponent } from './sbb-icon-realtime-add-stop.component';
import { IconRealtimeAlternativeComponent } from './sbb-icon-realtime-alternative.component';
import { IconRealtimeCancellationComponent } from './sbb-icon-realtime-cancellation.component';
import { IconRealtimeDelayComponent } from './sbb-icon-realtime-delay.component';
import { IconRealtimeMissedConnectionComponent } from './sbb-icon-realtime-missed-connection.component';
import { IconRealtimePlatformChangeComponent } from './sbb-icon-realtime-platform-change.component';
import { IconRealtimeRerouteComponent } from './sbb-icon-realtime-reroute.component';

@NgModule({
  imports: [],
  // tslint:disable-next-line:max-line-length
  declarations: [IconRealtimeAddStopComponent, IconRealtimeAlternativeComponent, IconRealtimeCancellationComponent, IconRealtimeDelayComponent, IconRealtimeMissedConnectionComponent, IconRealtimePlatformChangeComponent, IconRealtimeRerouteComponent],
  // tslint:disable-next-line:max-line-length
  exports: [IconRealtimeAddStopComponent, IconRealtimeAlternativeComponent, IconRealtimeCancellationComponent, IconRealtimeDelayComponent, IconRealtimeMissedConnectionComponent, IconRealtimePlatformChangeComponent, IconRealtimeRerouteComponent]
})
export class IconRealtimeModule { }
