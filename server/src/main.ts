import "dotenv/config";
import "../database/checkConnection";
import app from "./app";

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.info(`Server running on http://localhost:${port}`);
  console.info(`Swagger docs on http://localhost:${port}/api-docs`);
});
