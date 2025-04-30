[![npm version](https://img.shields.io/npm/v/@prograpedia/next-server-timing.svg)](https://www.npmjs.com/package/@prograpedia/next-server-timing)
[![npm downloads](https://img.shields.io/npm/dm/@prograpedia/next-server-timing.svg)](https://www.npmjs.com/package/@prograpedia/next-server-timing)
[![GitHub stars](https://img.shields.io/github/stars/prograpedia/next-server-timing.svg?style=social&label=Star)](https://github.com/prograpedia/next-server-timing)

# Next Server Timing

A lightweight library for Next.js applications that adds Server-Timing headers to HTTP responses. Enables performance monitoring of server operations with precise timing metrics, helping developers identify bottlenecks and optimize application performance.

## What is Server-Timing?

The [Server-Timing HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) allows web servers to communicate performance metrics about request-handling operations to the client. This enables developers to:

- Monitor server-side operations with high precision
- Track performance of server components, database queries, and other operations
- Visualize server timing metrics in browser developer tools
- Identify bottlenecks in your application's server-side processing

## Installation

```bash
# npm
npm install @prograpedia/next-server-timing

# yarn
yarn add @prograpedia/next-server-timing

# pnpm
pnpm add @prograpedia/next-server-timing
```

## Usage

### Configure with Next.js

Wrap your Next.js configuration with the `withServerTiming` function:

```ts
import { withServerTiming } from '@prograpedia/next-server-timing';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // your next config
};
export default withServerTiming(nextConfig);
```

### Create a Custom Server

If you're using a custom server setup, incorporate the library using the `requestHandlerWithServerTiming` function:

```ts
import next from "next";
import { createServer } from "node:http";
import { parse } from "node:url";

const app = next();

app.prepare().then(() => {
  const { requestHandlerWithServerTiming } = require("@prograpedia/next-server-timing");
  const handle = requestHandlerWithServerTiming(app.getRequestHandler());
  createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
```

### Instrument Server Actions

Add performance metrics to your server-side operations with the `timing` function:

```ts
"use server";
import { timing } from "@prograpedia/next-server-timing";

export async function action() {
  const metrics = timing();
  const time = performance.now();
  try {
    return await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    metrics["action"] = {dur: performance.now() - time, desc: "action"};
  }
}
```

## How It Works

The library creates and manages Server-Timing headers for your Next.js application:

1. It intercepts HTTP responses from your Next.js application
2. Collects timing metrics from your instrumented code using AsyncLocalStorage
3. Formats these metrics into standards-compliant Server-Timing headers
4. Appends these headers to the HTTP response before it's sent to the client

These metrics can then be viewed in your browser's developer tools under the Network tab.

## Browser Compatibility

Server-Timing headers are supported in most modern browsers:

- Chrome 65+
- Firefox 61+
- Edge 79+
- Safari 16.4+

## License

MIT
