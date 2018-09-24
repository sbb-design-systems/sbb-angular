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
        sh 'npm install'
        sh 'npm test'
        sh 'npm run lint'
      }
    }

    stage('When on develop, analyze for sonar') {
      when {
        branch 'develop'
      }
      steps {
        sh 'npm install'
        sh 'npm test'
        sh 'npm run lint'
        sh 'npm run build'
        withCredentials([
          usernameColonPassword(credentialsId: 'bin.sbb.ch', variable: 'NPM_CREDENTIALS')
        ]) {
          sh 'npm config set registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/'
          sh 'npm sbb:publish:develop-showcase'
        }
      }
    }

    stage('When on master, we create a release') {
      when {
        branch 'master'
      }
      steps {
        sh 'npm install'
        sh 'npm test'
        sh 'npm run lint'
        sh 'npm run build'
        withCredentials([
          usernameColonPassword(credentialsId: 'bin.sbb.ch', variable: 'NPM_CREDENTIALS')
        ]) {
          sh 'npm config set registry https://bin.sbb.ch/artifactory/api/npm/kd_esta.npm/'
          sh 'npm sbb:publish'
        }
      }
    }
  }

  post {
    failure {
      emailext(
        subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
          <p>See output in attachment.</p>""",
        attachLog: true,
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,stefan.meili@finconsgroup.com")
    }

    fixed {
      emailext(
        subject: "FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: """<p>FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
          <p>See output in attachment.</p>""",
        attachLog: true,
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,stefan.meili@finconsgroup.com")
    }
  }
}
