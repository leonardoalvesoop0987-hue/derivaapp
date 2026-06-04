module.exports = {
  apps: [
    {
      name: "deriva-pwa",
      script: "npm",
      args: "run start -- -p 3002",
      cwd: "/var/www/deriva-pwa",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
