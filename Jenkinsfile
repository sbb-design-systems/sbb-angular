#!groovy

String cron_string = BRANCH_NAME == 'develop' ? '@midnight' : ''

pipeline {
  agent { label 'nodejs' }
  triggers { cron(cron_string) }

  stages {
    stage('Installation') {
      steps {
        sh 'npm install'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'npm test'
        sh 'npm run lint'
      }
    }

    stage('When on develop, analyze for sonar') {
      when {
        branch 'develop'
      }
      steps {
        sh 'npm run build'
      }
    }

    stage('When on master, we create a release') {
      when {
        branch 'master'
      }
      steps {
        sh 'npm run build'
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

