import { Octokit } from 'octokit';
import { fileURLToPath } from 'url';

const githubToken = process.env['GITHUB_TOKEN'];
const pullRequestNumber = parseInt(process.env['PR_NUMBER']!, 10);
const failedBranches = process.env['FAILED_BRANCHES']?.split(' ').join(', ');
const failedReleaseVersion = process.env['FAILED_RELEASE'];

const repoConfig = {
  owner: 'sbb-design-systems',
  repo: 'sbb-angular',
};

const issuePath = {
  ...repoConfig,
  issue_number: 1346,
};

const prPath = {
  ...repoConfig,
  pull_number: pullRequestNumber,
};

class MaintenanceIssueUpdater {
  constructor(
    private _octokit: Octokit,
    private _now: Date,
  ) {}

  async run() {
    if (!failedBranches && !failedReleaseVersion) {
      throw new Error(
        `Unable to update maintenance issue.
        Please either specify FAILED_BRANCHES or FAILED_RELEASE`,
      );
    }

    const issue = await this._octokit.rest.issues.get(issuePath);

    if (!issue.data.body) {
      throw new Error('Could not load issue body');
    }

    const hint = '**Cherry-pick failed for the following pull requests / releases**';
    const dateInfo = `${this._now.toISOString()}`;
    let openTasks = this._extractOpenTasks(issue.data.body);
    let newTask;

    if (failedBranches) {
      const pr = await this._octokit.rest.pulls.get(prPath);
      if (!pr.data.title || !pr.data.html_url) {
        throw new Error('Could not load pull request');
      }

      newTask = `- [ ] PR [${pr.data.title}](${pr.data.html_url}) could not be cherry-picked into branch ${failedBranches})`;
    } else {
      newTask = `- [ ] CHANGELOG.md could not be cherry-picked for release ${failedReleaseVersion}`;
    }

    openTasks = this._addNewTask(openTasks, newTask);

    return this._octokit.rest.issues.update({
      ...issuePath,
      body: `${hint}\n${openTasks.join('\n')}\n\n${dateInfo}`,
    });
  }

  private _extractOpenTasks(issueBody: string = ''): string[] {
    return issueBody.split('\n').filter((line) => line.startsWith('- [ ]'));
  }

  private _addNewTask(tasks: string[], newTask: string): string[] {
    const newTasks = [newTask, ...tasks];
    return [...new Set(newTasks)];
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const maintenanceIssueUpdater = new MaintenanceIssueUpdater(
    new Octokit({
      auth: githubToken,
    }),
    new Date(),
  );
  maintenanceIssueUpdater.run();
}
