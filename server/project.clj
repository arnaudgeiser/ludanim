(defproject ch.waterbead.ludexploit/ludexploit-server "0.0.1-SNAPSHOT"
  :description "Backend to provide REST Services from a WP database"
  :url "http://www.ludesco.ch"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [compojure "1.4.0"]
                 [ring/ring-defaults "0.1.5"]
                 [ring-cors "0.1.7"]
                 [ring/ring-json "0.4.0"]
                 [org.clojure/java.jdbc "0.5.8"]
                 [php-clj "0.4.1"]
                 [org.mariadb.jdbc/mariadb-java-client "1.4.2"]
                 [cheshire "5.6.1"]
                 [clj-pdf "2.2.1"]
                 [clj-time "0.12.0"]
                 [com.draines/postal "2.0.0"]
                 [ring-basic-authentication "1.0.5"]
                 [crypto-password "0.2.0"]]
  :plugins [[lein-ring "0.9.7"]
       	    [brightnorth/uberjar-deploy "1.0.1"]]
  :java-source-paths ["src/main/java"]
  :license {:name "MIT"}
  :aliases {"jar" "uberjar"
	    "deploy" "uberjar-deploy"
	    "jaranddeploy" ["do" "jar," "deploy"]}
  :repositories [["snapshots" "http://archiva.ludine.ch/repository/snapshots"]]
  :ring {:handler ludexploit-cj.handler/app}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring/ring-mock "0.3.0"]]}})