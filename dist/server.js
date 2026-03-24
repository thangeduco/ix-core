"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app/app");
const env_1 = require("./shared/config/env");
app_1.app.listen(env_1.env.PORT, () => {
    console.log('iX-core is running on port ' + env_1.env.PORT);
});
