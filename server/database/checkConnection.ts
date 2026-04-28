import client from "./client";

const checkConnection = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await client.getConnection();
      console.info(`Using database ${process.env.DB_NAME}`);
      connection.release();
      return;
    } catch (error: any) {
      if (i === retries - 1) {
        console.warn(
          "Warning:",
          "Failed to establish a database connection.",
          "Please check your database credentials in the .env file if you need a database access."
        );
        console.warn(error.message);
      } else {
        console.info(`Database not ready, retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
};

checkConnection();
