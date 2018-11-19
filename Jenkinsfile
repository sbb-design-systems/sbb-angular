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
        sh 'npm run build'
      }
    }

    stage('When on feature branch, create feature branch showcase release') {
      when {
        branch 'feature/*'
      }
      steps {
        sh "npm run sbb:publish -- $BRANCH_NAME"
      }
    }

    stage('When on develop, create develop showcase release') {
      when {
        branch 'develop'
      }
      steps {
        sh 'npm run sbb:publish -- develop'
      }
    }

    stage('When on master, we create a release') {
      when {
        branch 'master'
      }
      steps {
        sh 'npm run sbb:publish'
      }
    }

    stage('Deploy') {
      when {
        anyOf {
          branch 'feature/*'
          branch 'develop'
          branch 'master'
        }
      }
      steps {
        script {
          try {
            cloud_callDeploy(
              cluster: 'aws',
              project: 'sbb-angular-showcase',
              dc: 'sbb-angular',
              credentialId: '265c7ecd-dc0c-4b41-b8b1-53a2f55d8181')
          } catch (e) {
            sleep(90)
            try {
              cloud_callDeploy(
                cluster: 'aws',
                project: 'sbb-angular-showcase',
                dc: 'sbb-angular',
                credentialId: '265c7ecd-dc0c-4b41-b8b1-53a2f55d8181')
            } catch (ex) {
              echo 'Failed to deploy'
            }
          }
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
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,stefan.meili@finconsgroup.com,marco.sut@finconsgroup.com,davide.genchi@finconsgroup.com")
    }

    fixed {
      emailext(
        subject: "FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: """<p>FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
          <p>See output in attachment.</p>""",
        attachLog: true,
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,stefan.meili@finconsgroup.com,marco.sut@finconsgroup.com,davide.genchi@finconsgroup.com")
    }
  }
}

