import type {ServerResponse} from "node:http";
import type {NextConfig} from "next";
import type {RequestHandler} from "next/dist/server/next";
import {createAsyncLocalStorage} from "next/dist/server/app-render/async-local-storage";

export type ServerTimingStore = Record<string, { dur?: number, desc?: string }>

export const serverTimingStorage = createAsyncLocalStorage<ServerTimingStore>();

export function timing() {
  const store = serverTimingStorage.getStore();
  if (!store) {
    // Don't use this in production
    console.warn("Server Timing store is not available when running `next dev`. Please create a custom server to use this feature.");
    return {};
  }
  return store;
}

export async function withServerTiming(config: NextConfig) {
  const original = config.webpack;
  config.webpack = (webpackConfig, context) => {
    if (context.isServer) {
      webpackConfig.externals = [
        ...webpackConfig.externals,
        {
          "@prograpedia/next-server-timing": "commonjs @prograpedia/next-server-timing",
        }
      ];
    }
    return original?.(webpackConfig, context) ?? webpackConfig;
  }
  return config;
}

export function requestHandlerWithServerTiming(handle: RequestHandler) {
  return (async (req, res, parsedUrl?) => {
    type WriteHead = ServerResponse["writeHead"];
    const originalWriteHead = res.writeHead.bind(res);

    function writeHead(...args: Parameters<WriteHead>) {
      const timing = Object.entries(scope).map(([key, value]) => {
        return `${key};dur=${value.dur};desc="${value.desc}"`;
      });
      if (!args[1]) {
        args[1] = {
          "Server-Timing": timing.join(", "),
        };
      } else if (typeof args[1] === "object") {
        if (Array.isArray(args[1])) {
          args[1].push(`Server-Timing: ${timing.join(", ")}`);
        } else {
          args[1]["Server-Timing"] = timing.join(", ");
        }
      }
      return originalWriteHead.apply(this, args);
    }

    res.writeHead = writeHead.bind(res);
    const scope: ServerTimingStore = {};
    await serverTimingStorage.run(scope, () => handle(req, res, parsedUrl));
  }) as RequestHandler
}
