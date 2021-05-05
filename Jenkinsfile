  pipeline {

    agent any
    stages{

        stage('Build'){

            steps{
                echo "Building..."
				withNPM(npmrcConfig: 'MyNprcConfig') {
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