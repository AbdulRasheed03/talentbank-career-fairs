/** @type {import('next').NextConfig} */
const nextConfig = {
  // @libsql/client ships native bits; keep it out of the server bundle.
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
