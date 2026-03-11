const _ = require("lodash");

function mapProperties(configuration) {
    return (data) => {
        if (data) {
            return Object.entries(data).reduce((accumulator, [key, value]) => {
                return _.set(accumulator, configuration[key] || key, value);
            }, {});
        }
        return data;
    };
}

module.exports = mapProperties;