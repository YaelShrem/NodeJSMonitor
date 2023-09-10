const express = require('express');
const app = express();
const PORT = 5000;
const responseTime=require("response-time");
const logger=require("./utils/logger");
// const swaggerDocs=require("./utils/swagger");
const { restResponseTimeHistogram, startMetricsServer }=require("./utils/metrics");

app.use(express.json());
app.use(
    responseTime((req, res, time) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        );
      }
    })
  );
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
    startMetricsServer();
    // swaggerDocs(app, port);
});

