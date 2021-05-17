import { SapphireClient } from "@sapphire/framework";
import "dotenv/config";

const client = new SapphireClient({
  defaultPrefix: "?",
});

client.login(process.env.token ?? "");
