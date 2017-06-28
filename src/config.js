'use strict';

var config = module.exports = {
    s3: {
        bucket: "rtsa-datapoint",
        createBucketIfNotPresent: "true"
    },

    clickStreamProcessor: {
        maxBufferSize: 1024 * 1024
    }
};
