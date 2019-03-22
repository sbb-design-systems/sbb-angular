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

    stage('Build library') {
      steps {
        sh 'npm run build:library'
      }
    }

    stage('Unit Tests') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'browserstack',
            passwordVariable: 'BROWSERSTACK_ACCESS_KEY',
            usernameVariable: 'BROWSERSTACK_USERNAME')
        ]) {
          sh 'npm test'
          sh 'npm run lint'
        }
        withSonarQubeEnv('Sonar NextGen') {
          script {
            def props = readJSON file: 'package.json'
            sh "npm run sonar -- -Dsonar.projectVersion=${props['version']} -Dsonar.branch=$BRANCH_NAME"
          }
        }
      }
    }

    stage('Build showcase') {
      steps {
        sh 'npm run build:showcase'
      }
    }

    stage('SonarcloudIO test') {
      when {
        branch 'feature/sonarcloud-io'
      }
      steps {
        withSonarQubeEnv('SonarCloud IO SBB') {
          //sh 'curl -v https://sonarcloud.io/batch/list'
          //sh 'curl -v https://sonarcloud.io/batch/file?name=sonar-scanner-engine-shaded-developer-7.7.0.22107-all.jar -o data.jar'
          sh 'npm run sonar -- -Dsonar.organization=sbb -Dsonar.branch=$BRANCH_NAME'
          // sh 'mvn -X -f mavendemo-parent/pom.xml -B clean org.jacoco:jacoco-maven-plugin:prepare-agent install sonar:sonar '
          //-Dsonar.cpd.exclusions=mavendemo-war/src/main/java/ch/sbb/mavendemo/web/MyServlet.java
          //-Dsonar.organization=sbb
          //-Dsonar.branch.target=master
          //-Dsonar.projectkey=ch.sbb.wzu.mavendemo:mavendemo-parent:exclusion
          //-Dsonar.branch.name=$BRANCH_NAME'
        }

        //sh "npm run sbb:publish -- $BRANCH_NAME"
      }
    }
/*
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
          cloud_callDeploy(
            cluster: 'aws',
            project: 'sbb-angular-showcase',
            dc: 'sbb-angular',
            credentialId: '265c7ecd-dc0c-4b41-b8b1-53a2f55d8181',
            doNotFailOnRunningDeployment: true)
        }
      }
    }
    */
  }

  post {
    failure {
      emailext(
        subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
          <p>See output in attachment.</p>""",
        attachLog: true,
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,marco.sut@finconsgroup.com,davide.genchi@finconsgroup.com")
    }

    fixed {
      emailext(
        subject: "FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: """<p>FIXED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
          <p>See output in attachment.</p>""",
        attachLog: true,
        to: "lukas.spirig@sbb.ch,davide.aresta@finconsgroup.com,marco.sut@finconsgroup.com,davide.genchi@finconsgroup.com")
    }
  }
}

