import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoaderBuilder } from './loader-builder';

export interface ModuleParams {
  packageName: string;
  id: string;
  loaderBuilderInterceptor?: (loaderBuilder: LoaderBuilder) => LoaderBuilder;
}

export const moduleParams = (route: ActivatedRoute): Observable<ModuleParams> => {
  return combineLatest([route.parent!.params, route.params, route.parent!.data, route.data]).pipe(
    map(
      ([parentParams, params, parentData, data]) =>
        ({ ...parentParams, ...params, ...parentData, ...data }) as ModuleParams,
    ),
  );
};
