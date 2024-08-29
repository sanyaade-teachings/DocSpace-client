/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

"use client";

import { Suspense, useEffect, useState } from "react";

let mockingPromise: Promise<boolean> | undefined;

// if we're running in the browser, start the worker
if (typeof window !== "undefined") {
  const { worker } = require("./browser");
  mockingPromise = worker.start({
    serviceWorker: {
      // This is useful if your application follows
      // a strict directory structure.
      url: "/login/mockServiceWorker.js",
    },
  });
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPromiseComplete, setIsPromiseComplete] = useState(false);

  useEffect(() => {
    if (mockingPromise)
      mockingPromise!.then(() => {
        setIsPromiseComplete(true);
      });
  }, []);

  if (isPromiseComplete) return children;

  return null;
}

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if MSW is enabled, we need to wait for the worker to start, so we wrap the
  // children in a Suspense boundary until the worker is ready
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}
