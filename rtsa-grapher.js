'use strict';


var fs = require('fs');
var path = require('path');
var util = require('util');
var kcl = require('aws-kcl');
var logger = require('./logger');
var os = require('os');

function recordProcessor() {
  var log = logger().getLogger('recordProcessor');
  var shardId;

  return {

    initialize: function(initializeInput, completeCallback) {
      shardId = initializeInput.shardId;

      completeCallback();
    },

    processRecords: function(processRecordsInput, completeCallback) {
      if (!processRecordsInput || !processRecordsInput.records) {
        completeCallback();
        return;
      }
      var records = processRecordsInput.records;
      var record, data, sequenceNumber, partitionKey;
      for (var i = 0 ; i < records.length ; ++i) {
        record = records[i];
        data = new Buffer(record.data, 'base64').toString();
        sequenceNumber = record.sequenceNumber;
        partitionKey = record.partitionKey;
				fs.appendFile('rtsa-graph.data', data + os.EOL, function err(){
					if(err){
						log.error('Error Writing Record: %s', err);
					}
				});
      }
      if (!sequenceNumber) {
        completeCallback();
        return;
      }

      processRecordsInput.checkpointer.checkpoint(sequenceNumber, function(err, sequenceNumber) {
        log.info(util.format('Checkpoint successful. ShardID: %s, SeqenceNumber: %s', shardId, sequenceNumber));
        completeCallback();
      });
    },

    shutdown: function(shutdownInput, completeCallback) {
      // Checkpoint should only be performed when shutdown reason is TERMINATE.
      if (shutdownInput.reason !== 'TERMINATE') {
        completeCallback();
        return;
      }
      // Whenever checkpointing, completeCallback should only be invoked once checkpoint is complete.
      shutdownInput.checkpointer.checkpoint(function(err) {
        completeCallback();
      });
    }
  };
}

kcl(recordProcessor()).run();
