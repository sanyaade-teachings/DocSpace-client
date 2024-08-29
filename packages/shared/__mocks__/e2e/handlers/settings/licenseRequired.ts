import { http, HttpResponse } from "msw";

import { API_PREFIX, BASE_URL } from "../../utils";

const PATH = "settings/license/required";

const url = `${BASE_URL}/${API_PREFIX}/${PATH}`;

export const licenseRequired = http.get(url, ({ cookies }) => {
  const isRequired = cookies.license_required;
  return HttpResponse.json({
    response: !!isRequired,
    count: 1,
    links: [
      {
        href: url,
        action: "GET",
      },
    ],
    status: 0,
    statusCode: 200,
    ok: true,
  });
});
