# Wealth Hub Web

## Development

To get started with this project, developers will need to follow these steps:

```
# clone the repository
git clone https://github.com/firstmac/wealth-hub

cd wealth-hub

# set the docker run script as executable
chmod +x run

# install the application dependencies
./run npm install --unsafe-perm

# start the app
./run npm start
```

This will now start the wealth hub application on port `3000` of your local development machine. On first generation, sometime the registration of content occurs after the server has been established and the user will see a `Cannot GET /` message. If you see this, stop the `npm start` command, and re-run it.

