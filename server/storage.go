package server

import (
    "github.com/crowdmob/goamz/aws"
    "github.com/crowdmob/goamz/s3"
    "github.com/codegangsta/cli"
    "log"
)

type ObjectStore interface {
    Init(c *cli.Context)
    Get(string) ([]byte, error)
    Put(string, []byte) error
}

type S3Adapter struct {
    S3 *s3.S3
    Bucket *s3.Bucket
}

func (adapter *S3Adapter) Init(c *cli.Context) {
    auth, err := aws.EnvAuth()
    if err != nil {
        log.Fatal(err)
    }
    
    // retrieve bucket region
    client := s3.New(auth, aws.USEast)
    a_bucket := client.Bucket(c.String("bucket"))
    location, _ := a_bucket.Location()
    
    region, ok := aws.Regions[location]
    if ok != true {
        log.Fatalf("Unable to locate region for bucket '%s' - location: %s\n", c.String("bucket"), location)
    }
    
    // establish connection
    adapter.S3 = s3.New(auth, region)
    
    adapter.Bucket = adapter.S3.Bucket(c.String("bucket"))
}

func (adapter *S3Adapter) Get(objectId string) (buffer []byte, err error) {
    buffer, err = adapter.Bucket.Get(objectId)
    
    return
}

func (adapter *S3Adapter) Put(objectId string, buffer []byte) (err error) {
    err = adapter.Bucket.Put(objectId, buffer, "text/plain", s3.BucketOwnerFull, s3.Options{})
    
    return
}
