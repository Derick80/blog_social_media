# Welcome to My Personal Blog!

I built my personal blog using ideas and code inspired by or directly written by the sources below: Many thanks!

---

## Technology used

- [Remix](https://remix.run)
- [React](https://reactjs.org)
- [Prisma](https://prisma.io)
- [PostgreSQL](https://postgresql.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Tutorials I used

- [Image uploads and other Methods](https://youtu.be/Mx9Xsq9JNXo)
  - [GitHub for above](https://github.com/sabinadams/kudos-remix-mongodb-prisma/tree/main/app)
- [Image uploads and other Methods text](https://www.prisma.io/blog/fullstack-remix-prisma-mongodb-3-By5pmN5Nzo1v)
- [Likes](https://github.com/kyh/yours-sincerely)
## S3-Image Upload

I used a combination of the newer remix docs and the video/github code

- I used the [remix-s3-uploader](https://github.com/remix-run/remix/tree/main/examples/file-and-s3-upload)

### Unused resources

These are resources or code that I wrote/used but did not end up using in the final product. I am leaving them here for reference.

- Comments code
- Audio player code

## Development

From your terminal:

```sh
$ npm install
$ npm run dev
```

```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment


to get a seeded prod db
fly deploy
fly ssh console -s
--pick instance.  For some reason only the 2nd one worked
then
npx prisma db push
npx prisma db seed


I tried to cite all sources used but if I missed one, please let me know and I will add it. Thanks!


## To use pgAdmin to directly edit the production data base run this command
fly proxy 6543:5432 -a <dch-blog> and leave running.
```
