  pipeline {

    agent any
    stages{

        stage('Build'){

            steps{
                echo "Building..."
				withNPM(npmrcConfig: '6c78e79e-2b95-48d5-8ce5-40bcc985cc20') {
				sh 'npm install'
				}
				sh 'npm run build'
                }
            }


        stage('Test') {

            steps{
                echo 'Start testing'
                sh 'npm run test'
            }
        }
    }


    post {

        success {
            emailext attachLog: true, 
                body: "Test status: ${currentBuild.currentResult}", 
                subject: 'Test passed', 
                to: 'siekacz@student.agh.edu.pl'
        }

        failure {
            emailext attachLog: true, 
                body: "Test status: ${currentBuild.currentResult}",
                subject: 'Test failed', 
                to: 'siekacz@student.agh.edu.pl'
        }
    }
}