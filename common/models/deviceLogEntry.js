

module.exports = function(DeviceLogEntry) {
    'use strict';
    
    // disable creation and destructive calls for log entries
    // allow finding and counting
    DeviceLogEntry.disableRemoteMethod('create', true);
    DeviceLogEntry.disableRemoteMethod('upsert', true);
    DeviceLogEntry.disableRemoteMethod('updateAll', true);
    DeviceLogEntry.disableRemoteMethod('updateAttributes', false);
    DeviceLogEntry.disableRemoteMethod('deleteById', true);
    DeviceLogEntry.disableRemoteMethod('createChangeStream', true);

    // disable find by id since log entries don't have an id
    DeviceLogEntry.disableRemoteMethod('findById', true);

    // allow 
    // DeviceLogEntry.disableRemoteMethod('find', true);
    // DeviceLogEntry.disableRemoteMethod('findOne', true);
    // DeviceLogEntry.disableRemoteMethod('confirm', true);
    // DeviceLogEntry.disableRemoteMethod('count', true);
    // DeviceLogEntry.disableRemoteMethod('exists', true);

};