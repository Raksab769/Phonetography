pipeline {
    agent any

    environment {
        IMAGE_NAME = "phonetography"
        CONTAINER_NAME = "phonetography-app"
        HOST_PORT = "8080"
    }

    stages {

        stage('Checkout') {
            steps {
                // Pulls the latest code from your GitHub repo
                git branch: 'main', url: 'https://github.com/raksab769/Phonetography.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove any existing container with the same name
                    sh '''
                        docker stop $CONTAINER_NAME || true
                        docker rm $CONTAINER_NAME || true
                    '''
                    // Run the new container
                    sh 'docker run -d --name phonetography-app -p 8090:80 phonetography'
                }
            }
        }

        stage('Health Check') {
            steps {
                // Give the container a moment to start, then confirm it responds
                sh '''
                    sleep 3
                    curl -sf http://localhost:8090/ > /dev/null && echo "Site is up and responding"
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully — Phonetography site is running in a container.'
        }
        failure {
            echo 'Pipeline failed — check the logs above for the failing stage.'
        }
    }
}
