import {GithubConfig} from '@angular/ng-dev';

/**
 * Github configuration for the ng-dev command. This repository is
 * uses as remote for the merge script.
 */
export const github: GithubConfig = {
  owner: 'sbb-design-systems',
  name: 'sbb-angular',
  mainBranchName: 'main',
  useNgDevAuthService: false,
};
