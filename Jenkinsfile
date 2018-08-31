#!groovy

String cron_string = BRANCH_NAME == 'develop' ? '@midnight' : ''

pipeline {
  agent { label 'nodejs' }
  triggers { cron(cron_string) }

  stages {
    stage('Unit Tests') {
      when {
        not { branch 'develop' }
        not { branch 'master' }
      }
      steps {
        withCredentials([
            usernamePassword(
              credentialsId: 'browserstack',
              passwordVariable: 'BROWSERSTACK_ACCESS_KEY',
              usernameVariable: 'BROWSERSTACK_USERNAME')
          ]) {
          sh 'npm install'
          sh 'npm test'
          sh 'npm run lint'
        }
      }
    }

    stage('When on develop, analyze for sonar') {
      when {
        branch 'develop'
      }
      steps {
        withCredentials([
            usernamePassword(
              credentialsId: 'browserstack',
              passwordVariable: 'BROWSERSTACK_ACCESS_KEY',
              usernameVariable: 'BROWSERSTACK_USERNAME')
          ]) {
          withSonarQubeEnv('Sonar SBB CFF FFS AG') {
            sh 'npm install'
            sh 'npm test'
            sh 'npm run lint'
            sh 'npm run sonar'
          }
        }
      }
    }

    stage('When on master, we create a release') {
      when {
        branch 'master'
      }
      steps {
        script {
          sh 'npm install'
        }
      }
    }
  }
}
