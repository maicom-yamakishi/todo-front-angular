pipeline {
    agent any
    stages {
        stage ('Build Frontend'){
            steps {
                bat 'mvn clean package -DskipTests=true'
            }
        }
        stage ('Unit test'){
            steps {
                bat 'mvn test'
            }
        }
    }
}