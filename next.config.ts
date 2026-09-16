import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site renders from JSON produced by the harness; make sure it ships with the serverless bundle.
  outputFileTracingIncludes: { "/**": ["./data/metrics.json", "./data/findings.json", "./data/graph/**"] },
};

export default nextConfig;
