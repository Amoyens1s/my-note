"use strict";
exports.__esModule = true;
exports.Plugin = void 0;
var Plugin = /** @class */ (function () {
    function Plugin() {
    }
    Plugin.prototype.load = function () {
        console.log('plugin 2 loaded');
    };
    return Plugin;
}());
exports.Plugin = Plugin;
