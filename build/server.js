"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startProxy = void 0;
const chalk_1 = __importDefault(require("chalk"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const request_1 = __importDefault(require("request"));
const proxy = express_1.default();
const startProxy = (port, credentials, origin) => {
    var _a;
    if (port === void 0) { port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8010'; }
    if (credentials === void 0) { credentials = false; }
    if (origin === void 0) { origin = '*'; }
    proxy.use(cors_1.default({ credentials: credentials, origin: origin }));
    proxy.options('*', cors_1.default({ credentials: credentials, origin: origin }));
    proxy.use('/', function (req, res) {
        const { path } = req;
        const url = path.slice(1);
        try {
            console.log(chalk_1.default.green('Request Proxied -> ' + url));
        }
        catch (e) { }
        req
            .pipe(request_1.default(url).on('response', (response) => {
            // In order to avoid https://github.com/expressjs/cors/issues/134
            const accessControlAllowOriginHeader = response.headers['access-control-allow-origin'];
            if (accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin) {
                console.log(chalk_1.default.blue('Override access-control-allow-origin header from proxified URL : ' +
                    chalk_1.default.green(accessControlAllowOriginHeader) +
                    '\n'));
                response.headers['access-control-allow-origin'] = origin;
            }
        }))
            .pipe(res);
    });
    proxy.listen(port);
    // Welcome Message
    console.log(chalk_1.default.bgGreen.black.bold.underline('\n Proxy Active \n'));
    console.log(chalk_1.default.blue('PORT: ' + chalk_1.default.green(port)));
    console.log(chalk_1.default.blue('Credentials: ' + chalk_1.default.green(credentials)));
    console.log(chalk_1.default.blue('Origin: ' + chalk_1.default.green(origin) + '\n'));
    console.log(chalk_1.default.cyan('To start using the proxy simply replace the proxied part of your url with: ' +
        chalk_1.default.bold('http://localhost:' + port + '/' + '\n')));
};
exports.startProxy = startProxy;
//# sourceMappingURL=server.js.map