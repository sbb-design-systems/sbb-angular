# Contributing

We appreciate all kinds of contributions. As a contributor, here are the guidelines we would like you to follow:

 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit-pr)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)
 - [Packages](#packages)

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository](https://github.com/sbb-design-systems/sbb-angular/issues/new). Including an issue
reproduction (via StackBlitz, JsBin, Plunkr, etc.) is the absolute best way to help the team quickly
diagnose the problem. Screenshots are also helpful.

You can help the team even more and [submit a Pull Request](#submit-pr) with a fix.


## <a name="feature"></a> Want a Feature?
You can *request* a new feature by [submitting an issue](#submit-issue)
to our [GitHub Repository](https://github.com/sbb-design-systems/sbb-angular/issues/new).
If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).


### <a name="submit-issue"></a> Submitting an Issue
If your issue appears to be a bug, and hasn't been reported, open a new issue.
Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Angular and @sbb-esta/angular Versions** - which versions of Angular and @sbb-esta/angular are affected
* **Motivation for or Use Case** - explain what are you trying to do and why the current behavior
    is a bug for you
* **Browsers and Operating System** - is this a problem with all browsers?
* **Reproduce the Error** - provide a live example (using StackBlitz or similar) or a unambiguous set of steps
* **Screenshots** - Due to the visual nature of @sbb-esta/angular, screenshots can help the team
    triage issues far more quickly than a text description.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
    causing the problem (line of code or commit)

You can file new issues by providing the above information [here](https://github.com/sbb-design-systems/sbb-angular/issues/new).


### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch main
     ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Test your changes with our supported browsers and screen readers.
* Run tests via `pnpm test all` and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit). Adherence to these conventions
  is necessary because release notes are automatically generated from these messages.

     ```shell
     git commit -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push my-fork my-fix-branch
    ```

* In GitHub, send a pull request to `sbb-angular:main`.
The PR title and message should as well conform to the [commit message conventions](#commit).

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).
* All public API methods **must be documented**.
* We use [prettier](https://prettier.io/) and [tslint](https://palantir.github.io/tslint/) rules to enforce code style.
* Also see [CODING_STANDARDS](./CODING_STANDARDS.md)

## <a name="commit"></a> Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to generate the changelog.

### Commit Message Format
```
<type>(<optional scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system, CI configuration or external dependencies
            (example scopes: gulp, broccoli, npm)
* **chore**: Other changes that don't modify `src` or `test` files

### Scope
The scope could be anything specifying place of the commit change. For example
`datepicker`, `dialog`, etc.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

### Styling
This project uses [SASS](https://sass-lang.com/) for styling the components.

## Language

We recommend using US English in all docs or examples.
