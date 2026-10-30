/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

// module.exports = 
module.exports = {
  ...nextConfig,
  env: {
    API_JIR3D: "http://localhost:3001",
    API_THINGIVERSE: "https://api.thingiverse.com",
    CLIENT_ID_THINGIVERSE: "REDACTED",
    CLIENT_SECRET_THINGIVERSE: "REDACTED", //This key allows your application to interact with Thingiverse. Keep it secret!
    APP_TOKEN_THINGIVERSE: "REDACTED_THINGIVERSE_TOKEN", //This token allows read only access to the Thingiverse API without requiring a user to authenticate.
    ACCESS_TOKEN_THINGIVERSE: "REDACTED_THINGIVERSE_TOKEN",
    // API_KEY_THINGIVERSE: "access_token=REDACTED_THINGIVERSE_TOKEN",
    // JIR3D_HOST: "jir3d.com"
  },

}
