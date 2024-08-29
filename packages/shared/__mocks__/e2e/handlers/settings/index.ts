import { colorTheme } from "./colorTheme";
import { licenseRequired } from "./licenseRequired";
import { machineName } from "./machineName";
import { portalCultures } from "./portalCultures";
import { portalPasswordSettings } from "./portalPasswordSettings";
import { portalTimeZone } from "./portalTimeZones";
import { settings } from "./settings";

const settingsHandlers = [
  settings,
  colorTheme,
  licenseRequired,
  machineName,
  portalCultures,
  portalPasswordSettings,
  portalTimeZone,
];

export default settingsHandlers;
