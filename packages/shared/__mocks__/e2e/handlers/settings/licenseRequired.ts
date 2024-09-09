import { API_PREFIX, BASE_URL, HEADER_LICENCE_REQUIRED } from "../../utils";

const PATH = "settings/license/required";

const url = `${BASE_URL}/${API_PREFIX}/${PATH}`;

export const licenseRequired = (headers?: Headers): Response => {
  let isRequired = false;

  if (headers?.get(HEADER_LICENCE_REQUIRED)) {
    isRequired = true;
  }

  if (isRequired)
    return new Response(
      JSON.stringify({
        response: true,
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
      }),
    );

  return new Response(
    JSON.stringify({
      response: false,
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
    }),
  );
};
