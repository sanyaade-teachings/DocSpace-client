const path = require("path");
const beforeBuild = require("@docspace/shared/utils/beforeBuild");

beforeBuild(
  [
    path.join(__dirname, "../public/locales"),
    path.join(__dirname, "../../../public/locales"),
  ],
  path.join(__dirname, "../src/autoGeneratedTranslations.ts"),
  {
    path: path.join(__dirname, "../../client/public/locales"),
    files: [
      "Settings.json",
      "Payments.json",
      "PaymentsEnterprise.json",
      "Translations.json",
      "Files.json",
    ],
    alias: "CLIENT_PUBLIC_DIR",
  }
);
