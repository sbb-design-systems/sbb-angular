'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var schematics$1 = require('@angular/cdk/schematics');
var config = require('@schematics/angular/utility/config');
var path = require('path');

function iconCdnProvider(options) {
    return async (tree, context) => {
        const workspace = config.getWorkspace(tree);
        const project = schematics$1.getProjectFromWorkspace(workspace, options.project);
        const targetDir = path.join(project.root, options.targetDir);
        const cdnIndex = await downloadIndex().catch(() => {
            context.logger.warn(`Unable to resolve ${options.cdnIndexUrl}. Falling back to empty configuration.`);
            return { version: 'local', icons: [] };
        });
        return schematics.mergeWith(schematics.apply(schematics.url('./files/provider'), [
            schematics.template({ cdnIndex, cdnBaseUrl: options.cdnBaseUrl }),
            schematics.move(targetDir),
        ]));
    };
    function downloadIndex() {
        return new Promise((resolve, reject) => {
            const { get } = options.cdnIndexUrl.startsWith('https') ? require('https') : require('http');
            get(options.cdnIndexUrl, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }
}

exports.iconCdnProvider = iconCdnProvider;
