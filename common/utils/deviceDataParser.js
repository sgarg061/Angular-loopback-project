var _ = require('lodash');

module.exports = {
    parseDeviceData: function (deviceInfo, customerId) {
        'use strict';

        var name = '';
        if (deviceInfo.name) {
            name = deviceInfo.name;
        } else if (_.isPlainObject(deviceInfo.address) && typeof deviceInfo.address.name === 'string') {
            name = deviceInfo.address.name;
        } else {
            name = 'Activated Device';
        }

        var address = '';
        if (typeof deviceInfo.address === 'string') {
            address = deviceInfo.address;
        } else if (_.isPlainObject(deviceInfo.address) && typeof deviceInfo.address.formatted_address === 'string') {
            address = deviceInfo.address.formatted_address;
        } else {
            address = 'Unknown address';
        }

        var location;
        if (deviceInfo.location && !isNaN(deviceInfo.location.lat) && !isNaN(deviceInfo.location.lng)) {
            location = {
                lat: parseFloat(deviceInfo.location.lat),
                lng: parseFloat(deviceInfo.location.lng)
            };
        }

        var organizationPath = '';
        var orgPathComponents = [];
        if (_.isPlainObject(deviceInfo.address) && deviceInfo.address.address_components instanceof Array) {
            var addressComponents = deviceInfo.address.address_components;
            var countryComponent = addressComponents.filter(function isCountryComponent(component) {
                if (!(component.types instanceof Array)) {
                    return false;
                }
                return component.types.filter(function(type) {
                    return type === 'country';
                }).length > 0;
            });

            if (countryComponent.length > 0) {
                orgPathComponents.push(countryComponent[0].long_name);
            }

            var provinceComponent = addressComponents.filter(function isProvinceComponent(component) {
                if (!(component.types instanceof Array)) {
                    return false;
                }
                return component.types.filter(function (type) {
                    return ['administrative_area_level_1'].indexOf(type) >= 0; // what qualifies as a province here?  Test different countries. TODO
                }).length > 0;
            });

            if (provinceComponent.length > 0) {
                orgPathComponents.push(provinceComponent[0].long_name);
            }

            var cityComponent = addressComponents.filter(function isCityComponent(component) {
                if (!(component.types instanceof Array)) {
                    return false;
                }
                return component.types.filter(function(type) {
                    return type === 'locality';
                }).length > 0;
            });

            if (cityComponent.length > 0) {
                orgPathComponents.push(cityComponent[0].long_name);
            }
        }
        if (orgPathComponents.length > 0) {
            organizationPath = orgPathComponents.join('/');
        }
        
        var deviceData = _.clone(deviceInfo);
        deviceData.name = name;
        deviceData.address = address;
        deviceData.username = deviceInfo.username ? deviceInfo.username : 'solink-local';
        deviceData.password = deviceInfo.password ? deviceInfo.password : '__connect__';
        deviceData.organizationPath = organizationPath;
        if (customerId) {
            deviceData.customerId = customerId;
        }
        if (location) {
            deviceData.location = location;
        } else {
            delete deviceData.location;
        }

        return deviceData;
    }
};
