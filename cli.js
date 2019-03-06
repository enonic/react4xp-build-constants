#!/usr/bin/env node
'use strict';

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _process$argv = _toArray(process.argv),
    argv = _process$argv.slice(2);

(0, _2.default)(argv[0], argv[1], argv[2]);