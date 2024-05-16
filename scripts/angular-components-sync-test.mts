import { Octokit } from 'octokit';

import { AngularComponentsSync } from '././angular-components-sync.mjs';

const commitList = [
  {
    sha: '667a555edff9422b879dd401ac53ce2d279ee1a4',
    node_id: 'C_kwDOAuvuAtoAKDY2N2E1NTVlZGZmOTQyMmI4NzlkZDQwMWFjNTNjZTJkMjc5ZWUxYTQ',
    commit: {
      author: {
        name: 'Kristiyan Kostadinov',
        email: 'crisbeto@users.noreply.github.com',
        date: '2022-01-17T14:06:13Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2022-01-17T14:06:13Z',
      },
      message:
        'refactor: enable useUnknownInCatchVariables compiler option (#24215)\n\nEnables the `useUnknownInCatchVariables` compiler option and fixes a couple of errors.',
      tree: {
        sha: 'bb456645791bd10f62aa0d10e79af34e3245056f',
        url: 'https://api.github.com/repos/angular/components/git/trees/bb456645791bd10f62aa0d10e79af34e3245056f',
      },
      url: 'https://api.github.com/repos/angular/components/git/commits/667a555edff9422b879dd401ac53ce2d279ee1a4',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJh5XfVCRBK7hj4Ov3rIwAAP5kIAC6E8xAfSjL1bxNc6S+mahZp\np9I76HVglwtWJuab1AbOOH80N/VuNQycY/OmPfc0MxuB5gp2FwdIcj84qs/14p7y\nuoYO8CQbU9R3K9FDnTif8NLjllIcdvRqblCEfjIcCh98mDlJlY4sJZCAqMbainyH\nVCH5pY3qWmpGByDMcNmDA15jZv9uKjzHBSJya2R6tuFRucRSLzC7ao9o6wJm1rkr\nX9ZjPxt7RA6H5XdQF60GfkaOoWN1ZabGk9oUNC95qBA1ncqDBMbZLNh5WTx88Sru\nrdApnRQfj6xMWh7rTwtLKxj809FaaZWhIBjsfnNhz5MQ9vbRKKh8EAtsasV4HEQ=\n=Q8a2\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree bb456645791bd10f62aa0d10e79af34e3245056f\nparent f63d669977282c4490f88a093580618a81b5bb9d\nauthor Kristiyan Kostadinov <crisbeto@users.noreply.github.com> 1642428373 +0100\ncommitter GitHub <noreply@github.com> 1642428373 +0000\n\nrefactor: enable useUnknownInCatchVariables compiler option (#24215)\n\nEnables the `useUnknownInCatchVariables` compiler option and fixes a couple of errors.',
      },
    },
    url: 'https://api.github.com/repos/angular/components/commits/667a555edff9422b879dd401ac53ce2d279ee1a4',
    html_url:
      'https://github.com/angular/components/commit/667a555edff9422b879dd401ac53ce2d279ee1a4',
    comments_url:
      'https://api.github.com/repos/angular/components/commits/667a555edff9422b879dd401ac53ce2d279ee1a4/comments',
    author: {
      login: 'crisbeto',
      id: 4450522,
      node_id: 'MDQ6VXNlcjQ0NTA1MjI=',
      avatar_url: 'https://avatars.githubusercontent.com/u/4450522?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/crisbeto',
      html_url: 'https://github.com/crisbeto',
      followers_url: 'https://api.github.com/users/crisbeto/followers',
      following_url: 'https://api.github.com/users/crisbeto/following{/other_user}',
      gists_url: 'https://api.github.com/users/crisbeto/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/crisbeto/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/crisbeto/subscriptions',
      organizations_url: 'https://api.github.com/users/crisbeto/orgs',
      repos_url: 'https://api.github.com/users/crisbeto/repos',
      events_url: 'https://api.github.com/users/crisbeto/events{/privacy}',
      received_events_url: 'https://api.github.com/users/crisbeto/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url: 'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url: 'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: 'f63d669977282c4490f88a093580618a81b5bb9d',
        url: 'https://api.github.com/repos/angular/components/commits/f63d669977282c4490f88a093580618a81b5bb9d',
        html_url:
          'https://github.com/angular/components/commit/f63d669977282c4490f88a093580618a81b5bb9d',
      },
    ],
  },
  {
    sha: 'f63d669977282c4490f88a093580618a81b5bb9d',
    node_id: 'C_kwDOAuvuAtoAKGY2M2Q2Njk5NzcyODJjNDQ5MGY4OGEwOTM1ODA2MThhODFiNWJiOWQ',
    commit: {
      author: {
        name: 'Kristiyan Kostadinov',
        email: 'crisbeto@users.noreply.github.com',
        date: '2022-01-17T14:05:27Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2022-01-17T14:05:27Z',
      },
      message:
        'build: add missing test (#24219)\n\nFixes a failure in the lint check due to a missing unit test.',
      tree: {
        sha: '281fdd0db5037917951279c4142bacda698e5fa7',
        url: 'https://api.github.com/repos/angular/components/git/trees/281fdd0db5037917951279c4142bacda698e5fa7',
      },
      url: 'https://api.github.com/repos/angular/components/git/commits/f63d669977282c4490f88a093580618a81b5bb9d',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJh5XenCRBK7hj4Ov3rIwAAjBYIADQ8td7owVMFLmjuzKEEpvrf\njGWUEVd4mygzqtB1lkUt/pW4lLskk3PAJhBPyjVRxYLeeWcghPwSI8NHOsKhW3ZJ\nellFfd39niu4r7ApCkSlSALkqyn28UpUYOCzYZghaPA7n1B1wrHevfsaDrLcg1Pb\n2TaFVB9wisChzr17NwbO9cpvvXMdjxs4dWjphxdym62jgY5R2qaPscaKSQSXZlzo\nyMwaWLpMBnPNeeDFU/akje87r20AXpb2IbOe/PQc23BDINTO4k2J+VHOYsXZO8SA\nWpliPK83To9u/pDVkdZvRN7M1eYWWKhhESHC7FCzY7XK//3GMLneJeXPw0i73wI=\n=B1qv\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree 281fdd0db5037917951279c4142bacda698e5fa7\nparent 99c611219181b8014a6ed4c585939eda9a97f7f5\nauthor Kristiyan Kostadinov <crisbeto@users.noreply.github.com> 1642428327 +0100\ncommitter GitHub <noreply@github.com> 1642428327 +0000\n\nbuild: add missing test (#24219)\n\nFixes a failure in the lint check due to a missing unit test.',
      },
    },
    url: 'https://api.github.com/repos/angular/components/commits/f63d669977282c4490f88a093580618a81b5bb9d',
    html_url:
      'https://github.com/angular/components/commit/f63d669977282c4490f88a093580618a81b5bb9d',
    comments_url:
      'https://api.github.com/repos/angular/components/commits/f63d669977282c4490f88a093580618a81b5bb9d/comments',
    author: {
      login: 'crisbeto',
      id: 4450522,
      node_id: 'MDQ6VXNlcjQ0NTA1MjI=',
      avatar_url: 'https://avatars.githubusercontent.com/u/4450522?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/crisbeto',
      html_url: 'https://github.com/crisbeto',
      followers_url: 'https://api.github.com/users/crisbeto/followers',
      following_url: 'https://api.github.com/users/crisbeto/following{/other_user}',
      gists_url: 'https://api.github.com/users/crisbeto/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/crisbeto/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/crisbeto/subscriptions',
      organizations_url: 'https://api.github.com/users/crisbeto/orgs',
      repos_url: 'https://api.github.com/users/crisbeto/repos',
      events_url: 'https://api.github.com/users/crisbeto/events{/privacy}',
      received_events_url: 'https://api.github.com/users/crisbeto/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url: 'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url: 'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: '99c611219181b8014a6ed4c585939eda9a97f7f5',
        url: 'https://api.github.com/repos/angular/components/commits/99c611219181b8014a6ed4c585939eda9a97f7f5',
        html_url:
          'https://github.com/angular/components/commit/99c611219181b8014a6ed4c585939eda9a97f7f5',
      },
    ],
  },
  {
    sha: '99c611219181b8014a6ed4c585939eda9a97f7f5',
    node_id: 'C_kwDOAuvuAtoAKDk5YzYxMTIxOTE4MWI4MDE0YTZlZDRjNTg1OTM5ZWRhOWE5N2Y3ZjU',
    commit: {
      author: {
        name: 'Kristiyan Kostadinov',
        email: 'crisbeto@users.noreply.github.com',
        date: '2022-01-17T13:18:51Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2022-01-17T13:18:51Z',
      },
      message:
        'fix(select): component value not in sync with control value on init (#18443)\n\nFixes the `MatSelect.value` property not being in sync with the `ControlValueAccessor` initial value on init.\n\nFixes #18423.',
      tree: {
        sha: '4ffd7654c8a5d043c180347aa507da80652345d5',
        url: 'https://api.github.com/repos/angular/components/git/trees/4ffd7654c8a5d043c180347aa507da80652345d5',
      },
      url: 'https://api.github.com/repos/angular/components/git/commits/99c611219181b8014a6ed4c585939eda9a97f7f5',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJh5Wy7CRBK7hj4Ov3rIwAApzoIAA4Kfo9uC3zDfWGXHwrDfo0y\nbLrZAfIQUtmUcQQ9ZYGllPdekOTeufiRJ6Q4ATOsIYQ6QTioiLDBn0xze5lDR4wz\nYqTT0BrXq7ean7dgpIPk/I/W3YLli8Mal9SFjm3jY+E6b/p7JxfIJ/ViCszwv7JY\n873Kig/7W19nqOe0lTtTB9CqezvM7eoAShNCTz2+2pyphkMhPcHMTshoZkKrVL2a\nWZ1WuJstb9y+BlYrzV/KogLFOade8bPdkHzPNgdF2GPBjMm4lp7WTmjAF+Oy12TU\nySgRdYOmxi4f9qLwa61NX2F4TS1rRoVtA0US3ZIRv9Ie3oR2wkdQfdkpf2lbjJQ=\n=ef/L\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree 4ffd7654c8a5d043c180347aa507da80652345d5\nparent 0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465\nauthor Kristiyan Kostadinov <crisbeto@users.noreply.github.com> 1642425531 +0100\ncommitter GitHub <noreply@github.com> 1642425531 +0000\n\nfix(select): component value not in sync with control value on init (#18443)\n\nFixes the `MatSelect.value` property not being in sync with the `ControlValueAccessor` initial value on init.\n\nFixes #18423.',
      },
    },
    url: 'https://api.github.com/repos/angular/components/commits/99c611219181b8014a6ed4c585939eda9a97f7f5',
    html_url:
      'https://github.com/angular/components/commit/99c611219181b8014a6ed4c585939eda9a97f7f5',
    comments_url:
      'https://api.github.com/repos/angular/components/commits/99c611219181b8014a6ed4c585939eda9a97f7f5/comments',
    author: {
      login: 'crisbeto',
      id: 4450522,
      node_id: 'MDQ6VXNlcjQ0NTA1MjI=',
      avatar_url: 'https://avatars.githubusercontent.com/u/4450522?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/crisbeto',
      html_url: 'https://github.com/crisbeto',
      followers_url: 'https://api.github.com/users/crisbeto/followers',
      following_url: 'https://api.github.com/users/crisbeto/following{/other_user}',
      gists_url: 'https://api.github.com/users/crisbeto/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/crisbeto/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/crisbeto/subscriptions',
      organizations_url: 'https://api.github.com/users/crisbeto/orgs',
      repos_url: 'https://api.github.com/users/crisbeto/repos',
      events_url: 'https://api.github.com/users/crisbeto/events{/privacy}',
      received_events_url: 'https://api.github.com/users/crisbeto/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url: 'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url: 'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
        url: 'https://api.github.com/repos/angular/components/commits/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
        html_url:
          'https://github.com/angular/components/commit/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
      },
    ],
  },
  {
    sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
    node_id: 'C_kwDOAuvuAtoAKDBmNDdiN2EyYTRjYWI0ZWE4ZjYwMDZhMmJlNTRhM2U5MmVjMjE0NjU',
    commit: {
      author: {
        name: 'Paul Gschwendtner',
        email: 'paulgschwendtner@gmail.com',
        date: '2022-01-15T21:50:21Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2022-01-15T21:50:21Z',
      },
      message:
        "chore: improve type safety in breakpoint observer (#14356)\n\n* Fixes a workaround where we cast the MediaQueryList event listener to any because TypeScript didn't have proper types before TS 3.1.",
      tree: {
        sha: 'b2c5a550c62ac3582498c330038dd049834058b9',
        url: 'https://api.github.com/repos/angular/components/git/trees/b2c5a550c62ac3582498c330038dd049834058b9',
      },
      url: 'https://api.github.com/repos/angular/components/git/commits/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJh40GdCRBK7hj4Ov3rIwAAwcEIAC6ZfxSamLYV+G9XYc/BscYd\nVTOwDInccxtF7zJlV1GIFaYG8HDet1QczgN21jCZlemNg7jBRpQV/GurmoQjfVz0\ny4Tr9Z8+dlsAQY2WAUZEKe+o+6HI0Eu5PIy4JMe9NC/rGSmOrfK1cd16of9ocwHT\nc6Z15c7A6g6KFbQH9YPA/CMstBycIjmckZRAd1dPcqGcjjtgXqT52R3ELgJz0ikA\nxz1IEIEur2JpbiTCUSCXwEAxqb2viiaMwo95nuCqDRmCgI6pSRFAb9eL2fvgJLQ+\n7ze0mJPwq3EzwH5KVaxEmboHyDiQTBVTxpAXqmFFukqMB4p5RGQdcJewU16DKdM=\n=K2br\n-----END PGP SIGNATURE-----\n',
        payload:
          "tree b2c5a550c62ac3582498c330038dd049834058b9\nparent f10d245cca22930e6d88aad03ede12f50f96746f\nauthor Paul Gschwendtner <paulgschwendtner@gmail.com> 1642283421 +0100\ncommitter GitHub <noreply@github.com> 1642283421 +0000\n\nchore: improve type safety in breakpoint observer (#14356)\n\n* Fixes a workaround where we cast the MediaQueryList event listener to any because TypeScript didn't have proper types before TS 3.1.",
      },
    },
    url: 'https://api.github.com/repos/angular/components/commits/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
    html_url:
      'https://github.com/angular/components/commit/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465',
    comments_url:
      'https://api.github.com/repos/angular/components/commits/0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465/comments',
    author: {
      login: 'devversion',
      id: 4987015,
      node_id: 'MDQ6VXNlcjQ5ODcwMTU=',
      avatar_url: 'https://avatars.githubusercontent.com/u/4987015?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/devversion',
      html_url: 'https://github.com/devversion',
      followers_url: 'https://api.github.com/users/devversion/followers',
      following_url: 'https://api.github.com/users/devversion/following{/other_user}',
      gists_url: 'https://api.github.com/users/devversion/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/devversion/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/devversion/subscriptions',
      organizations_url: 'https://api.github.com/users/devversion/orgs',
      repos_url: 'https://api.github.com/users/devversion/repos',
      events_url: 'https://api.github.com/users/devversion/events{/privacy}',
      received_events_url: 'https://api.github.com/users/devversion/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url: 'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url: 'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: 'f10d245cca22930e6d88aad03ede12f50f96746f',
        url: 'https://api.github.com/repos/angular/components/commits/f10d245cca22930e6d88aad03ede12f50f96746f',
        html_url:
          'https://github.com/angular/components/commit/f10d245cca22930e6d88aad03ede12f50f96746f',
      },
    ],
  },
  {
    sha: 'f10d245cca22930e6d88aad03ede12f50f96746f',
    node_id: 'C_kwDOAuvuAtoAKGYxMGQyNDVjY2EyMjkzMGU2ZDg4YWFkMDNlZGUxMmY1MGY5Njc0NmY',
    commit: {
      author: {
        name: 'Ruslan Lekhman',
        email: 'lekhman112@gmail.com',
        date: '2022-01-15T21:49:29Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2022-01-15T21:49:29Z',
      },
      message: 'feat(material/tabs): label & body classes (#23691)\n\ncloses #23685, #9290, #15997',
      tree: {
        sha: '6080d205b131337349f90f8e015e6a359e8e0f74',
        url: 'https://api.github.com/repos/angular/components/git/trees/6080d205b131337349f90f8e015e6a359e8e0f74',
      },
      url: 'https://api.github.com/repos/angular/components/git/commits/f10d245cca22930e6d88aad03ede12f50f96746f',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJh40FpCRBK7hj4Ov3rIwAAAkgIAA+jU7dPfMQxCoZiNZ5M/73a\n/Q7v/la0nkAk9OE2930aUi0auptHXTGuiXX/VUr5A6BAnnpO4oxZdAPw+HqwEo/R\nISjuAr3B3IqE5KyBOMQ8yn7Df8pTLbl0OVc/hAYlhsSl4AnBdLCb3eB6mgR467pN\n9Al0WI9iVZi8+2JW1iPEJQL3rf0IXU9t7FVygSWaYHldISdsAPROgIqplIdYPGQ1\nSdhfUqKS/vqEfCswjqd7o0zYxwiBRi8ikRFNBXuaMILGwEFvhpQCjLlSoPjcttlj\nOJouinCCZgk25KVvboQG/05B7Didx/AEMrvInBpSQWXD0M/dgHIv6b/XwtF78fw=\n=unTN\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree 6080d205b131337349f90f8e015e6a359e8e0f74\nparent 653e46bda332157c1ec0c92913ce462e48b905f4\nauthor Ruslan Lekhman <lekhman112@gmail.com> 1642283369 -0700\ncommitter GitHub <noreply@github.com> 1642283369 +0000\n\nfeat(material/tabs): label & body classes (#23691)\n\ncloses #23685, #9290, #15997',
      },
    },
    url: 'https://api.github.com/repos/angular/components/commits/f10d245cca22930e6d88aad03ede12f50f96746f',
    html_url:
      'https://github.com/angular/components/commit/f10d245cca22930e6d88aad03ede12f50f96746f',
    comments_url:
      'https://api.github.com/repos/angular/components/commits/f10d245cca22930e6d88aad03ede12f50f96746f/comments',
    author: {
      login: 'lekhmanrus',
      id: 2744696,
      node_id: 'MDQ6VXNlcjI3NDQ2OTY=',
      avatar_url: 'https://avatars.githubusercontent.com/u/2744696?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/lekhmanrus',
      html_url: 'https://github.com/lekhmanrus',
      followers_url: 'https://api.github.com/users/lekhmanrus/followers',
      following_url: 'https://api.github.com/users/lekhmanrus/following{/other_user}',
      gists_url: 'https://api.github.com/users/lekhmanrus/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/lekhmanrus/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/lekhmanrus/subscriptions',
      organizations_url: 'https://api.github.com/users/lekhmanrus/orgs',
      repos_url: 'https://api.github.com/users/lekhmanrus/repos',
      events_url: 'https://api.github.com/users/lekhmanrus/events{/privacy}',
      received_events_url: 'https://api.github.com/users/lekhmanrus/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url: 'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url: 'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: '653e46bda332157c1ec0c92913ce462e48b905f4',
        url: 'https://api.github.com/repos/angular/components/commits/653e46bda332157c1ec0c92913ce462e48b905f4',
        html_url:
          'https://github.com/angular/components/commit/653e46bda332157c1ec0c92913ce462e48b905f4',
      },
    ],
  },
];

testNoChecked();
testSomeChecked();
testSomeCheckedWithGap();
testSomeCheckedNotAtStart();
testNoContent();
testNoOutputContent();

function testNoChecked() {
  test(
    createIssueBody(
      [
        { checked: false, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: false, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
    createIssueBody(
      [
        { checked: false, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: false, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
  );
}
function testSomeChecked() {
  test(
    createIssueBody(
      [
        { checked: true, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: true, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
    createIssueBody(
      [
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      '99c611219181b8014a6ed4c585939eda9a97f7f5',
    ),
  );
}
function testSomeCheckedWithGap() {
  test(
    createIssueBody(
      [
        { checked: true, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: true, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: true, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
    createIssueBody(
      [
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: true, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      '99c611219181b8014a6ed4c585939eda9a97f7f5',
    ),
  );
}
function testSomeCheckedNotAtStart() {
  test(
    createIssueBody(
      [
        { checked: false, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: true, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: true, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
    createIssueBody(
      [
        { checked: false, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: true, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: true, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
  );
}
function testNoContent() {
  test(
    createIssueBody('none', 'f10d245cca22930e6d88aad03ede12f50f96746f'),
    createIssueBody(
      [
        { checked: false, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: false, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: false, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: false, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
  );
}
function testNoOutputContent() {
  test(
    createIssueBody(
      [
        { checked: true, sha: '0f47b7a2a4cab4ea8f6006a2be54a3e92ec21465' },
        { checked: true, sha: '99c611219181b8014a6ed4c585939eda9a97f7f5' },
        { checked: true, sha: 'f63d669977282c4490f88a093580618a81b5bb9d' },
        { checked: true, sha: '667a555edff9422b879dd401ac53ce2d279ee1a4' },
      ],
      'f10d245cca22930e6d88aad03ede12f50f96746f',
    ),
    createIssueBody('none', '667a555edff9422b879dd401ac53ce2d279ee1a4'),
  );
}

async function test(input: string, expectedOutput: string) {
  let done = false;
  let result = '';
  const angularComponentsSync = new AngularComponentsSync(
    createOctokitMock(input, (body) => {
      result = body;
      done = true;
    }),
    new Date(0),
  );
  await angularComponentsSync.run();
  const expected = result === expectedOutput;
  console.log('done', done, 'expected', expected);
  if (!expected) {
    console.log('expected');
    console.error(result);
    console.log('to equal');
    console.log(expectedOutput);
  }
}

function createIssueBody(commits: { checked: boolean; sha: string }[] | 'none', lastSha: string) {
  return `In order to get the newest findings from angular/components, we like to check every commit of angular/components.\r
\r
**Commits**\r
${
  commits === 'none'
    ? 'No unchecked commits'
    : commits
        .map(
          (commit) =>
            `- [${commit.checked ? 'x' : ' '}] [${
              commitList
                .find((origCommit) => origCommit.sha === commit.sha)!
                .commit.message.match(/^(.*)$/m)![0]
            }](https://github.com/angular/components/commit/${commit.sha})`,
        )
        .join('\r\n')
}\r
\r
**Commits to be considered for the next major release**\r
 - ...\r
\r
Last synchronization:\r
\`1970-01-01T00:00:00.000Z\`\r
\r
Last checked sha:\r
\`${lastSha}\``;
}

function createOctokitMock(issueBody: string, receiveBody: (body: string) => void) {
  return {
    rest: {
      issues: {
        get: () => ({
          data: {
            body: issueBody,
          },
        }),
        update: (payload: any) => {
          receiveBody(payload.body);
        },
      },
      repos: {
        listCommits: () => ({
          data: commitList,
        }),
      },
    },
  } as unknown as Octokit;
}
