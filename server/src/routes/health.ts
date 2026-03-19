import express from "express";

const routerTest = express.Router();
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 */
routerTest.get("/health", (req, res) => {
  res.send("API OK");
});

export default routerTest;
