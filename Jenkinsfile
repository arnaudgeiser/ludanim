node {
	stage('checkout') {
		checkout scm
	}
	stage('build') {
		sh './gradlew -Dgradle.user.home=/root/.gradle uploadArchives'
	}
}
