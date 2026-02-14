pipeline {
    agent any

    environment {
        // Set these as Jenkins credentials or replace with your Docker Hub username/repo
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_USER = 'your-dockerhub-username'
        BACKEND_IMAGE = "${DOCKERHUB_USER}/devops-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/devops-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Backend Image') {
            steps {
                script {
                    sh 'docker build -t $BACKEND_IMAGE:latest ./backend'
                }
            }
        }
        stage('Build Frontend Image') {
            steps {
                script {
                    sh 'docker build -t $FRONTEND_IMAGE:latest ./frontend'
                }
            }
        }
        stage('Test') {
            steps {
                // Force remove any old backend and frontend containers
                sh 'docker rm -f backend || true'
                sh 'docker rm -f frontend || true'
                // Clean up any Compose containers
                sh 'docker compose -f docker-compose.yaml down || true'
                // Start fresh containers
                sh 'docker compose -f docker-compose.yaml up -d'
                // Optionally run API/UI tests here
                // sleep time for services to be up
                sh 'sleep 10'
                // Example: curl health check (customize as needed)
                sh 'curl -f http://localhost:5000/health || exit 1'
                sh 'curl -f http://localhost:3000 || exit 1'
                sh 'docker compose -f docker-compose.yaml down'
            }
        }
        stage('Push Images') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $BACKEND_IMAGE:latest'
                    sh 'docker push $FRONTEND_IMAGE:latest'
                }
            }
        }
    }
    post {
        always {
            sh 'docker compose -f docker-compose.yaml down || true'
        }
    }
}
