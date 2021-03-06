# call-home-server
---	

## Object Model

![](https://github.com/SolinkCorp/call-home-server/blob/master/doc/Call_Home_Domain_Model.png)

## Setup

	git clone https://github.com/SolinkCorp/call-home-server.git
	cd call-home-server
	npm install 
	npm install -g bower


## Running in Development

### Prerequisites
-   You could get some error where you have downloaded bower but the computer cannot detect it.
 	In this case, go add a path called: C:\Users\yourusername\AppData\Roaming\npm
 	and then try again.
- Redis process (port: 6379) (required for socket clustering for updating the UI dynamically)
- Postgres (port: 5432, password for superuser(postgres): solink, database name: call-home)
To set up PostgreSQL to run:
	0. Install version 9.4 or higher from here: http://www.postgresql.org/download/
	0. Download pgAdmin III on your computer and open it
	0. To get /node ./ to run (as required below), create a new database called 'call-home': right-click "Databases" in your Object Browser on the left, click New Databases, enter name 'call-home'

More specific config data stored in [server/datasources.json](server/datasources.json) and [config.js](config.js).

### Command for running
Running as a single Node process:

	node . # then browse to localhost:3000

Running as a local cluster using Strongloop PM:

	slc start
	slc ctl status call-home-server

Resizing the cluster (to one worker in this example)

	slc ctl set-size call-home-server 1
	slc ctl status


Stopping the cluster

	slc ctl stop call-home-server
	slc ctl status

Creating sample data (if tables werent created yet, run and stop the server once)

	node server/create-sample-data.js

## Interactive Console

The application can be run as an interactive console in order to test out code with the app context loaded or to query server data. To run the console, execute: 

	node . --console
	
Information about the context will be printed out and you'll be able to write code interactively. For example, try:

	Cloud.find({}, function(err, res) { console.log(res); });

## Logging

The Call Home Server uses Winston as an asynchronous logging framework. Multiple transports are used for logging to support writing to the console in development as well as the file system and or a distributed logging service in production.

Logging can be configured by changing parameters in the [config.js](config.js) file. Note that this file only includes a handful of the available configuration settings. Logging transport can be further adjusted by adding to the configuration json in the [server/logger.js](server/logger.js) file.

See [https://github.com/winstonjs/winston](https://github.com/winstonjs/winston) for full configuration details.


## Testing
Find the test file you need under	call-home-server/server/test. 

#### In Linux/OSX

To run the REST API test suite, execute:

	npm test
	
If jshint detects problems, the tests will fail. They can be forced past the jshint check by running:

	npm test --force
	
To run a single test: 

	NODE_ENV=test ./node_modules/mocha/bin/mocha -R spec server/test/checkin-test.js
	

#### In Windows

To install mocha, type in command prompt:

	npm install -g mocha

Then, run

	set NODE_ENV=test

To run the tests overall, execute:

	mocha -R spec server/test

At the end of the test, there should be a line 
		
	XX passing
	XX failing
	
## Production Deployment

### Amazon AWS AMI Creation

Start image **ami-e7527ed7** (Amazon Linux AMI 2015.03 (HVM), SSD Volume Type)

Connect to the new instance

	ssh -i ~/ec2keys/personal/tylercope1gmailcom.pem ec2-user@ec2-52-26-168-229.us-west-2.compute.amazonaws.com

Install updates

	sudo yum update

Install node and development tools as root

	sudo su -
	curl --silent --location https://rpm.nodesource.com/setup | bash -
	yum -y install nodejs 
	yum install -y gcc-c++ make

Install strongloop-pm (see http://strong-pm.io/prod/)

	sudo npm install -g strong-pm

Install the process manager as a service

	sudo sl-pm-install --upstart=0.6
	sudo /sbin/initctl start strong-pm

Setup HTTP authentication (see http://docs.strongloop.com/display/SLC/Setting+up+a+production+host)

Install elasticsearch as a service

	rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
	vi /etc/yum.repos.d/elasticsearch.repo

Type the following in the repo file and then save and exit the file:

	[elasticsearch-1.7]
	name=Elasticsearch repository for 1.7.x packages
	baseurl=http://packages.elastic.co/elasticsearch/1.7/centos
	gpgcheck=1
	gpgkey=http://packages.elastic.co/GPG-KEY-elasticsearch
	enabled=1

Install elasticsearch and add it as a service

	yum install elasticsearch
	chkconfig --add elasticsearch

Start elasticsearch

	/etc/init.d/elasticsearch start

Test that elasticsearch working

	curl -X GET http://localhost:9200/

### Launch Instance of new Image

Launch instance and tag it appropriately

	aws ec2 run-instances --image-id ami-27b2bc17 --count 1 --instance-type t2.micro --key-name tyler.cope+1@gmail.com --region us-west-2 --security-group-ids sg-b08959d4 
	aws ec2 create-tags --resources i-9813b75d --tags Key=Name,Value=solink-call-home-server

Get the public ip

	aws ec2 describe-instances --query Reservations[].Instances[].PublicDnsName --filter Name=tag:Name,Values=solink-call-home-server

Connect to instance

	ssh -i ~/ec2keys/personal/tylercope1gmailcom.pem ec2-user@ec2-54-148-122-8.us-west-2.compute.amazonaws.com

Test that elasticsearch is up

	curl -X GET http://localhost:9200/

Test that Strongloop PM is up

	curl -X GET http://localhost:8701

---------------------------------------

### Build and deploy the app 		
 		
From a local checkout of the project build and deploy the app to the new instance		
 		
    slc build		
    slc deploy http://ec2-54-148-122-8.us-west-2.compute.amazonaws.com
