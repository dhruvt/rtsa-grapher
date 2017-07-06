# RealTime Sentiment Analysis Grapher

This package provides a graphing interface to the RTSA Core Module and displays the resulting Sentiment Graph that updates in real time.

The grapher uses the Amazon KCL to process the streaming data. The KCL takes care of many of the complex tasks associated with distributed computing, such as load-balancing across multiple instances, responding to instance failures, checkpointing processed records, and reacting to changes in stream volume.

As a part of the KCL, this package wraps and manages the interaction with the [MultiLangDaemon][multi-lang-daemon], which is provided as part of the [Amazon KCL for Java][amazon-kcl-github] and therefore will download some required dependencies.

## Before You Get Started

### Prerequisite
Before you begin, Node.js and NPM must be installed on your system. For download instructions for your platform, see http://nodejs.org/download/.

Amazon KCL for Node.js uses [MultiLangDaemon][multi-lang-daemon] provided by [Amazon KCL for Java][amazon-kcl-github]. You also need Java version 1.7 or higher installed.

### Setting Up the Environment
Before running the grapher, make sure that your environment is configured to allow the samples to use your [AWS Security Credentials](http://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html), which are used by [MultiLangDaemon][multi-lang-daemon] to interact with AWS services.

By default, the [MultiLangDaemon][multi-lang-daemon] uses the [DefaultAWSCredentialsProviderChain][DefaultAWSCredentialsProviderChain], so make your credentials available to one of the credentials providers in that provider chain. There are several ways to do this. You can provide credentials through a `~/.aws/credentials` file or through environment variables (**AWS\_ACCESS\_KEY\_ID** and **AWS\_SECRET\_ACCESS\_KEY**). If you're running on Amazon EC2, you can associate an IAM role with your instance with appropriate access.

For more information about [Amazon Kinesis][amazon-kinesis] and the client libraries, see the
[Amazon Kinesis documentation][amazon-kinesis-docs] as well as the [Amazon Kinesis forums][kinesis-forum].

## Running the RTSA-Grapher

`npm install`
`node .\run-grapher.js -p .\sample.properties -j <path-to-java.exe> -c <path-to-lib-folder> -e`

The following values are used in the sample application:

* *Stream name*: `RTSADataPoints`
* *Number of shards*: 5
* *Amazon KCL application name*: `rtsa-grapher`
* *Amazon DynamoDB table for Amazon KCL application*: `rtsa-grapher`

#### Notes
* The Amazon KCL for Node.js uses stdin/stdout to interact with [MultiLangDaemon][multi-lang-daemon]. Do not point your application logs to stdout/stderr. If your logs point to stdout/stderr, log output gets mingled with [MultiLangDaemon][multi-lang-daemon], which makes it really difficult to find consumer-specific log events. This consumer uses a logging library to redirect all application logs to a file called application.log. Make sure to follow a similar pattern while developing consumer applications with the Amazon KCL for Node.js. For more information about the protocol between the MultiLangDaemon and the Amazon KCL for Node.js, go to [MultiLangDaemon][multi-lang-daemon].
* The run-grapher script downloads [MultiLangDaemon][multi-lang-daemon] and its dependencies.
* The run-grapher script invokes the [MultiLangDaemon][multi-lang-daemon], which starts the Node.js consumer application as its child process. By default:
  * The file `sample.properties` controls which Amazon KCL for Node.js application is run. You can specify your own properties file with the `-p` or `--properties` argument.
  * The bootstrap script uses `JAVA_HOME` to locate the java binary. To specify your own java home path, use the `-j` or `--java` argument when invoking the bootstrap script.
* To only print commands on the console to run the KCL application without actually running the KCL application, leave out the `-e` or `--execute` argument to the bootstrap script.

### Cleaning Up
This sample application creates an [Amazon Kinesis][amazon-kinesis] stream, sends rtsa datapionts to it, and creates a DynamoDB table to track the KCL application state. This will incur nominal costs to the associated AWS account, and continue to do so even when the grapher is not running. To stop being charged, delete these resources. Specifically, the sample application creates following AWS resources:

* An *Amazon Kinesis stream* named `RTSADataPoints`
* An *Amazon DynamoDB table* named `rtsa-grapher`

You can delete these using the AWS Management Console.

## Running on Amazon EC2
Log into an Amazon EC2 instance running Amazon Linux, then perform the following steps to prepare your environment for running the grapher application. Note the version of Java that ships with Amazon Linux can be found at `/usr/bin/java` and should be 1.7 or greater.

```sh
    # install node.js, npm and git
    sudo yum install nodejs npm --enablerepo=epel
    sudo yum install git
    npm install
    node .\run-grapher.js -p .\sample.properties -j <path-to-java.exe> -c <path-to-lib-folder> -e
```
