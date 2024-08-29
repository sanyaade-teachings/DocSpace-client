import { http, HttpResponse } from "msw";

import LogoTestSvgUrl from "PUBLIC_DIR/images/logo/loginpage.svg?url";

import { BASE_URL } from "../utils";

const PATH = "logo.ashx";

const url = `${BASE_URL}:5111/${PATH}`;

export const logo = http.get(url, ({ request }) => {
  const reqUrl = new URL(request.url);

  const logoType = reqUrl.searchParams.get("logotype");
  const dark = reqUrl.searchParams.get("dark");
  const defaultParam = reqUrl.searchParams.get("default");
  const culture = reqUrl.searchParams.get("culture");

  return HttpResponse.json(LogoTestSvgUrl);
});
