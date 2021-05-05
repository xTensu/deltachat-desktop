  pipeline {

    agent any
    stages{

        stage('Build'){

            steps{
                echo "Building..."
                }
            }


        stage('Test') {

            steps{
                echo 'Start testing'
                sh 'npm test'
            }
        }
    }


    post {

        success {
            emailext attachLog: true, 
                body: "Test status: ${currentBuild.currentResult}", 
                subject: 'Test passed', 
                to: 'jackob126@gmail.com'
        }

        failure {
            emailext attachLog: true, 
                body: "Test status: ${currentBuild.currentResult}",
                subject: 'Test failed', 
                to: 'jackob126@gmail.com'
        }
    }
}