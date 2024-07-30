import { AppConfig } from "./type";
import * as constants from "./constants";
import {networkConfig} from "@/config/networks";

export * from "./type";

export const appConfig: AppConfig & {
    constants: typeof constants
} = {
    networks: networkConfig,
    constants
}
