import cron from "node-cron";

console.log(process.env.BACKEND_URI_PROD);
cron.schedule("*/8 * * * *", async () => {
  const backendUrl = process.env.BACKEND_URI_PROD;
  console.log("backendUrl", backendUrl);
  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    console.log("Backend restarted successfully");
  }
});
