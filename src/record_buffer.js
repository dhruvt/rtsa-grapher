'use strict';

function recordBuffer(size){
    var buffer=[];
    var firstSequenceNumber = 0;
    var lastSequenceNumber = 0;
    var totalRecords = 0;
    var currentSize = 0;
    var delimiter = '\n';

    function _clear(){
        buffer.length=0;
        firstSequenceNumber = 0;
        lastSequenceNumber = 0;
        totalRecords = 0;
        currentSize = 0;
    }

    return{

        putRecord: function(data,seq,callback){
            if(!data){
                return;
            }

            var record = new Buffer(data + delimiter);
            if (firstSequenceNumber === 0) {
                firstSequenceNumber = seq;
            }

            lastSequenceNumber=seq;
            currentSize+=record.length;
            buffer.push(record);
        },

        readAndClearRecords: function(){
            var buf = new Buffer.concat(buffer,currentSize);
            _clear();
            return buf;
        },

         setDelimiter: function(delimiter) {
            delimiter = delimiter;
        },

        getFirstSequenceNumber: function() {
            return firstSequenceNumber;
        },

        getLastSequenceNumber: function() {
            return lastSequenceNumber;
        },
        shouldFlush: function() {
            if (currentSize >= size) {
                return true;
            }
        }
    };
}

module.exports = recordBuffer;
