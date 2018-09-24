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

    stage('TESTING') {
      when {
        branch 'feature/deployment'
      }
      steps {
        sh 'npm run build'
        sh 'npm run sbb:publish:develop-showcase'
      }
    }

    stage('When on develop, create develop showcase release') {
      when {
        branch 'develop'
      }
      steps {
        sh 'npm run build'
        sh 'npm run sbb:publish:develop-showcase'
      }
    }

    stage('When on master, we create a release') {
      when {
        branch 'master'
      }
      steps {
        sh 'npm run build'
        sh 'npm run sbb:publish'
      }
    }
  }
/*
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
*/
}
