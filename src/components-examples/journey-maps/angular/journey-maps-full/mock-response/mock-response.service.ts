import { Injectable } from '@angular/core';

import { zhBeWyleregg } from './journey/zh-be_wyleregg';
import { zhShWaldfriedhof } from './journey/zh-sh_waldfriedhof';
import { bielLyssRoutes, bielLyssRoutesOptions } from './routes/biel-lyss';
import { bnLsRoutes, bnLsRoutesOptions } from './routes/bn-ls';
import { bernIndoor } from './transfer/bern-indoor';
import { geneveIndoor } from './transfer/geneve-indoor';
import { luzern4j } from './transfer/luzern4-j';
import { zurichIndoor } from './transfer/zurich-indoor';
import { bernBurgdorfZones } from './zone/bern-burgdorf';
import { baselBielZones } from './zone/bs-bl';

@Injectable()
export class MockResponseService {
  data = {
    baselBielZones,
    bernBurgdorfZones,
    bernIndoor,
    bielLyssRoutes,
    bielLyssRoutesOptions,
    bnLsRoutes,
    bnLsRoutesOptions,
    geneveIndoor,
    luzern4j,
    zhBeWyleregg,
    zhShWaldfriedhof,
    zurichIndoor,
  };
}
