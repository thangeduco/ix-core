import { app } from "./app/app";
import { env } from "./shared/config/env";

app.listen(env.PORT, () => {
  console.log('iX-core is running on port ' + env.PORT);
});
