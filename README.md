imagearmory
===========

Client side encrypting image host. Server is in Go, and frontend uses crypto.js

### Install

`imagearmory` uses `godep` to manage dependencies. You need to have it installed and restore dependencies using

    $ go get github.com/tools/godep
    $ godep restore

Install the binary using `go install` to your `$GOPATH/bin` and run the server using (sample)

    AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY="secret" $GOPATH/bin/imagearmory --storage s3 --bucket targetbucket

Use Ubuntu Upstart to set it to run on system boot. 

By default, the server will run on port 8080. I suggest using Nginx as a proxy so you can make a virtual host for the service respond on port 80 and share the server with other applications. 

### Setup (Amazon S3)

The target Amazon S3 bucket must be configured with the correct CORS Configuration. Sample policy looks like

    <CORSConfiguration>
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <MaxAgeSeconds>3000</MaxAgeSeconds>
            <AllowedHeader>Authorization</AllowedHeader>
        </CORSRule>
        <CORSRule>
           <AllowedOrigin>*</AllowedOrigin>
           <AllowedMethod>GET</AllowedMethod>
        </CORSRule>
    </CORSConfiguration>

The second rule is the important in this case allowing GET requests from all origins. The wildcard '*' refers to all origins. Alternative is to use the deployment origin to restrict the XHR calls.

**Coming Soon**

The VPS that I run this on only has a 30gb HD, so I'm going to have the server write the data to S3. That'll also allow for some useful load balancing techniques. If that works, I'll get this to work
on a SaaS host like Elastic Beanstalk or AppEngine. 

In order to do that, I need to quit using auto-incrementing ID numbers for the files and use a file hash of some kind. If I used auto-incrementing numbers, then having multiple frontends would lead to different servers getting out of sync about the current file number 

TODOs
=====

- Re-introduce local storage options (via adapter/cli switch)

- UI loading indicators
