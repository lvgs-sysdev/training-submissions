import { scanPost } from "../controllers/LocationInfoControl";
import { coordinateSchema } from "@/sharedObject/typeDiffinition";

register.post("/scanResult", { schema: coordinateSchema }, scanPost);
