# Frontend Development

## npm and nodejs
for debian wheezy nodejs is not in the debian Repository. Install (as root)

	wget https://deb.nodesource.com/setup
	chmod +x setup
	./setup
	apt-get install nodejs

## Install node_modules and Vendor-Libs

	Global Install (as root): npm install -g grunt-cli && npm install -g karma-cli && npm install -g bower
	Local Install (as user):
	cd Packages/Application/Lightwerk.SurfCaptain/
	npm install
	bower install

## run grunt
- run an alias defined in grunt/aliases.yaml e.g. grunt standard
- for running tests with grunt a running karma is required (s. below)


## E2E and Unit Tests

	export CHROME_BIN=chromium-browser (Linux Systems)
	karma start karma.conf.js (if no X use xvfb-run)
	grunt test

## Sources
- Getting started unit-testing Angular: http://www.ng-newsletter.com/advent2013/#!/day/19
- Supercharging your Gruntfile: http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/
