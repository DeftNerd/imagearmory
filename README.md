imagearmory
===========

Client side encrypting image host. Server is in Go, and frontend uses crypto.js

**Installation**
COmpile the Go program by going into the server directory and typing "go build". It will generate an appliation called "server"

Use Ubuntu Upstart to set it to run on system boot. 

By default, the server will run on port 8080. I suggest using Nginx as a proxy so you can make a virtual host for the service respond on port 80 and share the server with other applications. 

** Coming Soon **
The VPS that I run this on only has a 30gb HD, so I'm going to have the server write the data to S3. That'll also allow for some useful load balancing techniques. If that works, I'll get this to work
on a SaaS host like Elastic Beanstalk or AppEngine. 

In order to do that, I need to quit using auto-incrementing ID numbers for the files and use a file hash of some kind. If I used auto-incrementing numbers, then having multiple frontends would lead to different servers getting out of sync about the current file number 
