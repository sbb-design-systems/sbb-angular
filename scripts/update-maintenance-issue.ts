import { Octokit } from 'octokit';

const githubToken = process.env['GITHUB_TOKEN'];
const pullRequestNumber = parseInt(process.env['PR_NUMBER']!, 10);
const failedBranches = process.env['FAILED_BRANCHES']!.split(' ').join(', ');

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
  constructor(private _octokit: Octokit, private _now: Date) {}

  async run() {
    const issue = await this._octokit.rest.issues.get(issuePath);
    const pr = await this._octokit.rest.pulls.get(prPath);

    if (!issue.data.body) {
      throw new Error('Could not load issue body');
    }

    if (!pr.data.title || !pr.data.html_url) {
      throw new Error('Could not load pull request');
    }

    const hint = '**Unable to cherry-pick the following pull requests**';
    const dateInfo = `${this._now.toISOString()}`;
    let openTasks = this._extractOpenTasks(issue.data.body);
    openTasks = this._addNewTask(
      openTasks,
      `- [ ] [${pr.data.title}](${pr.data.html_url}) (Branches: ${failedBranches})`
    );

    return this._octokit.rest.issues.update({
      ...issuePath,
      body: `${hint}\n${openTasks.join('\n')}\n\n${dateInfo}`,
    });
  }

  private _extractOpenTasks(issueBody: string = ''): string[] {
    return issueBody.split('\n').filter((line) => line.startsWith('- [ ]'));
  }

  private _addNewTask(tasks: string[], newTask: string): string[] {
    const newTasks = [...tasks, newTask];
    return [...new Set(newTasks)];
  }
}

if (module === require.main) {
  const maintenanceIssueUpdater = new MaintenanceIssueUpdater(
    new Octokit({
      auth: githubToken,
    }),
    new Date()
  );
  maintenanceIssueUpdater.run();
}
