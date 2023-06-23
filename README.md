# Pricecheck dashboard

_By Bnomio_

## Quick start

~~~
$ npm ci      # Use npm i when installing new packages
$ npm run dev
~~~

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Preview server

~~~
$ ssh pricecheck-dashboard@157.245.238.207
$ cd $SITE_DIR
~~~

## Build and deploy

To avoid possible unforeseen conflicts, remove everything in the remote directory `$SITE_DIR/public/` (`$SITE_DIR` is defined in the remote server)

Upload the base project (run this locally at the repository root):

~~~
$ rsync -chrtvz \
    --exclude="/node_modules" \
    --exclude="/out" \
    --exclude=".vscode" \
    ./* \
    pricecheck-dashboard@157.245.238.207:/var/www/vhosts/pricecheck-dashboard.bnomio.dev/public
~~~

ssh into the remote server, then:

~~~
$ cd $SITE_DIR
$ npm ci && npm run build    # Install dependencies and compile
$ pm2 stop 0
$ pm2 delete 0
$ pm2 start npm --name "next" -- start    # Start the http server
~~~

### API requests

By default, the targeted api is `https://p3bv2.bnomio.dev/`

Override this via an `.env.development` file, or `.env.production` for production:

~~~sh
# .env.development or .env.production
NEXT_PUBLIC_API_URL=https://api.example.org
~~~

Use `.env*.local` to override for local development and testing. Don't check these in!

### Production mode

As an alternative for production, this variable can be set in the environment itself for when you run `npm run build`:

~~~
$ NEXT_PUBLIC_API_URL=https://api.example.org npm run build
# wait for the build to finish...
$ npm run start # <- no need to set env var anymore
~~~

Variables set in the environment this way will override variables set in `.env*` files.
