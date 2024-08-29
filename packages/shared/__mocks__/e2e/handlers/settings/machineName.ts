import { http, HttpResponse } from "msw";

import { API_PREFIX, BASE_URL } from "../../utils";

const PATH = "settings/machine";

const url = `${BASE_URL}/${API_PREFIX}/${PATH}`;

export const machineName = http.get(url, () => {
  return HttpResponse.json({
    response: "127.0.0.1",
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
