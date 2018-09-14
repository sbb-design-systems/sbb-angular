const _ = require('lodash');

checkArgAllowed = (actualArg) => {
    const paramKeys = Object.keys(scriptConfiguration);
    console.log(paramKeys);
    if (paramKeys.indexOf(actualArg) < 0) {
        const errorString = actualArg + ' argument is not allowed. Supported parameters list is: ' + paramKeys;
        throw new Error(errorString);
    }
}

exports.processArgumentsCheck = () => {
    process.argv.forEach(function (val, index, array) {
        if (val && !!val.split('=')[1]) {
            const paramKey = val.split('=')[0];
            try {
                checkArgAllowed(paramKey);
                const paramValue = val.split('=')[1];
                switch (paramKey) {
                    case 'svgPath':
                        scriptConfiguration.svgBasePath = paramValue;
                        break;
                    case 'outputPath':
                        scriptConfiguration.baseOutputPath = paramValue;
                        break;
                    case 'iconSelectorPrefix':
                        scriptConfiguration.iconSelectorPrefix = paramValue;
                        break;
                    case 'svgClass':
                        scriptConfiguration.svgClass = paramValue;
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        }
    });
}

exports.outputStatsPrint = (modules, outputStats) => {
    console.log('Original SVGs: ' + outputStats.sourceSVGs.length);
    console.log('Created components: ' + outputStats.createdComponents.length);
    console.log('Created Modules:');
    _.forEach(modules, (module) => {
      console.log('Name: ' + _.padEnd(module.name, 40) + ' # Components: ' + module.components.length);
    });
    console.log('\nDiscarded components: ' + outputStats.discardedComponents.length);
    console.log('\nDiscarded components details: ');
    outputStats.discardedComponents.forEach((discardedComponent, index) => {
      console.log(
        _.padEnd((index + 1) + '.\tSource:', 42) + discardedComponent.discarded.sourceFileName + '\n' +
        _.padEnd('\tAlready created source:', 40) + discardedComponent.included.sourceFileName + '\n' +
        _.padEnd('\tSelector created:', 40) + discardedComponent.included.selector);
    });
  }