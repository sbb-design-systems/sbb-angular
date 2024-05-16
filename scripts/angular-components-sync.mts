import { Octokit } from 'octokit';
import { fileURLToPath } from 'url';

interface IssueBody {
  emptyList: boolean;
  lastSha: string;
  commits: { checked: boolean; sha: string }[];
  body: string;
}

interface GithubCommit {
  sha: string;
  commit: { message: string };
}

const githubToken = process.env.GITHUB_TOKEN || `YOUR_LOCAL_TEST_TOKEN`;

const issuePath = {
  owner: 'sbb-design-systems',
  repo: 'sbb-angular',
  issue_number: 1047,
};

const commitsInIssueStart = '**Commits**';
const commitsInIssueEnd = '**Commits';
const commitsInIssueRegex = new RegExp(
  `${escapeRegex(commitsInIssueStart)}(.*)${escapeRegex(commitsInIssueEnd)}`,
  's',
);
const lastSynchronizationTitle = `Last synchronization:`;
const lastSynchronizationInIssueRegex = new RegExp(
  escapeRegex(lastSynchronizationTitle) + '\r\n' + '`(.*)`\r\n',
  's',
);
const lastCheckedShaTitle = `Last checked sha:`;
const lastCheckedShaInIssueRegex = new RegExp(
  escapeRegex(lastCheckedShaTitle) + '\r\n' + '`(.*)`',
  's',
);
const emptyListInIssueMessage = 'No unchecked commits';

export class AngularComponentsSync {
  constructor(
    private _octokit: Octokit,
    private _now: Date,
  ) {}

  async run() {
    const issue = await this._loadIssue();
    if (!issue.data.body) {
      throw new Error('Could not load issue body');
    }
    const parsedIssue = this._parseIssue(issue.data.body);

    const firstUncheckedCommit = parsedIssue.commits.find((commit) => !commit.checked);
    const referenceSha = parsedIssue.emptyList
      ? parsedIssue.lastSha
      : firstUncheckedCommit?.sha || parsedIssue.commits[parsedIssue.commits.length - 1].sha;

    if (!referenceSha) {
      throw new Error('Could not determine reference sha (last checked commit)');
    }

    const latestAngularComponentsCommits = (await this._loadLatestAngularComponentsCommits())
      .data as GithubCommit[];

    const commitsEndIndex = latestAngularComponentsCommits.findIndex(
      (commit) => commit.sha === referenceSha,
    );

    if (commitsEndIndex === -1) {
      throw new Error(
        `Could not find commit with sha ${referenceSha}. This can happen because we only check the last 100 commits.`,
      );
    }

    let issueBody = '';

    // If all previous issues were checked or the issue commit list is empty
    if (!firstUncheckedCommit || parsedIssue.emptyList) {
      issueBody = this._createIssueBody(
        latestAngularComponentsCommits.slice(0, commitsEndIndex),
        parsedIssue,
        referenceSha,
      );
    } else {
      const commitsInRange = latestAngularComponentsCommits.slice(0, commitsEndIndex + 1);

      const lastCheckedCommitBeforeNotCheckedIndex =
        latestAngularComponentsCommits.findIndex(
          (commit) => commit.sha === firstUncheckedCommit.sha,
        ) + 1;

      const newReferenceSha =
        latestAngularComponentsCommits[lastCheckedCommitBeforeNotCheckedIndex].sha;
      issueBody = this._createIssueBody(commitsInRange, parsedIssue, newReferenceSha);
    }

    await this._updateIssue(issueBody);
  }

  private async _loadIssue() {
    return this._octokit.rest.issues.get(issuePath);
  }

  private async _loadLatestAngularComponentsCommits() {
    return this._octokit.rest.repos.listCommits({
      owner: 'angular',
      repo: 'components',
      per_page: 100,
    });
  }

  private async _updateIssue(body: string) {
    return this._octokit.rest.issues.update({
      ...issuePath,
      body: body,
    });
  }

  private _parseIssue(issueBody: string): IssueBody {
    const emptyList = issueBody.includes(emptyListInIssueMessage);
    return {
      lastSha: issueBody.match(lastCheckedShaInIssueRegex)![1],
      emptyList,
      commits: emptyList
        ? []
        : issueBody
            .match(commitsInIssueRegex)![1]
            .trim()
            .split('\r\n')
            .map((line) => ({
              checked: line.startsWith('- [x]'),
              sha: line.match(/angular\/components\/commit\/(.*)\)/)![1],
            })),
      body: issueBody,
    };
  }

  private _createIssueBody(
    commitsInRange: GithubCommit[],
    issueBody: IssueBody,
    newReferenceSha: string,
  ) {
    const commitsInIssueBlock = `${commitsInIssueStart}\r\n${
      commitsInRange.length
        ? this._createIssueCommits(commitsInRange, issueBody)
        : emptyListInIssueMessage
    }\r\n\r\n${commitsInIssueEnd}`;

    const lastShaBlock = `${lastCheckedShaTitle}\r\n\`${newReferenceSha}\``;
    const lastSynchronizationBlock = `${lastSynchronizationTitle}\r\n\`${this._now.toISOString()}\`\r\n`;

    return issueBody.body
      .replace(commitsInIssueRegex, commitsInIssueBlock)
      .replace(lastCheckedShaInIssueRegex, lastShaBlock)
      .replace(lastSynchronizationInIssueRegex, lastSynchronizationBlock);
  }

  private _createIssueCommits(commitsInRange: GithubCommit[], issueBody: IssueBody) {
    return commitsInRange
      .reverse()
      .map((commit) =>
        this._createIssueCommitLine(
          issueBody.commits.some(
            (existentCommit) => existentCommit.sha === commit.sha && existentCommit.checked,
          ),
          this._extractCommitSubject(commit.commit.message),
          commit.sha,
        ),
      )
      .join('\r\n');
  }

  private _createIssueCommitLine(checked: boolean, subject: string, sha: string) {
    return `- [${
      checked ? 'x' : ' '
    }] [${subject}](https://github.com/angular/components/commit/${sha})`;
  }

  private _extractCommitSubject(message: string) {
    return message.match(/^(.*)$/m)?.[0] || '';
  }
}

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const angularComponentsSync = new AngularComponentsSync(
    new Octokit({
      auth: githubToken,
    }),
    new Date(),
  );
  angularComponentsSync.run();
}
