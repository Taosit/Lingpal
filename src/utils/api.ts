export const fetcher = async ({
  url,
  method = "GET",
  body,
  token,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  token?: string;
}) => {
  console.log("fetch options", {
    method,
    ...(body && { body }),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authentication: `Bearer ${token}` }),
    },
  });
  const res = await fetch(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authentication: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
    };
  }

  try {
    const data = await res.json();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: true,
      data: res,
    };
  }
};
