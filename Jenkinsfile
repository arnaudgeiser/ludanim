node {
	stage('checkout') {
		checkout scm
	}
	stage('build') {
		sh './client/gradlew -Dgradle.user.home=/root/.gradle -b client/build.gradle uploadArchives'
	}
}