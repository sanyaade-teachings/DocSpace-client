// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

const path = require("path");
const fs = require("fs");

const publishPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "publish",
  "web",
  "editor",
);

const nextBuild = path.join(process.cwd(), "..", ".next");
const configFolder = path.join(__dirname, "..", "config");
const loggerFile = path.join(__dirname, "..", "src", "logger.mjs");
const serverFile = path.join(__dirname, "..", "server.prod.js");

const rootNodeModulesPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "node_modules",
);

fs.cpSync(
  path.join(rootNodeModulesPath, "pino-pretty"),
  `${nextBuild}/standalone/node_modules/pino-pretty`,
  { recursive: true },
);
fs.cpSync(
  path.join(rootNodeModulesPath, "pino-roll"),
  `${nextBuild}/standalone/node_modules/pino-roll`,
  { recursive: true },
);
fs.cpSync(
  path.join(rootNodeModulesPath, "pino-cloudwatch"),
  `${nextBuild}/standalone/node_modules/pino-cloudwatch`,
  { recursive: true },
);
fs.cpSync(
  path.join(rootNodeModulesPath, "date-fns"),
  `${nextBuild}/standalone/node_modules/date-fns`,
  { recursive: true },
);
fs.cpSync(
  path.join(rootNodeModulesPath, "chunky-stream"),
  `${nextBuild}/standalone/node_modules/chunky-stream`,
  { recursive: true },
);
fs.cpSync(
  path.join(rootNodeModulesPath, "readable-stream"),
  `${nextBuild}/standalone/node_modules/readable-stream`,
  { recursive: true },
);
fs.cpSync(configFolder, `${publishPath}/config`, { recursive: true });
fs.cpSync(nextBuild, `${publishPath}/.next`, { recursive: true });
fs.cpSync(
  path.join(nextBuild, "standalone", "node_modules"),
  `${publishPath}/node_modules`,
  { recursive: true },
);
fs.copyFileSync(serverFile, `${publishPath}/server.js`);
fs.copyFileSync(loggerFile, `${publishPath}/logger.mjs`);
