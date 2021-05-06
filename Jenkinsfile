  pipeline {

    agent any
	tools {nodejs "nodejs"}
    stages{

        stage('Build'){

            steps{
                echo "Building..."
				sh 'rm -rf deltachat-desktop'
				sh 'git clone https://github.com/deltachat/deltachat-desktop.git'
				sh 'cd deltachat-desktop'
				withNPM(npmrcConfig: '6c78e79e-2b95-48d5-8ce5-40bcc985cc20') {
				sh 'npm install'
				}
				sh 'npm run build'
				sh 'apt install libnss3'
				sh 'npm start'
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
		
		always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
        }
    }
}