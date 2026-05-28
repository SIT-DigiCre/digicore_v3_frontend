if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[n]) return;
    let t = {};
    const r = (e) => a(e, n),
      f = { exports: t, module: { uri: n }, require: r };
    s[n] = Promise.all(c.map((e) => f[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-3c9d0171"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { revision: "d751713988987e9331980363e24189ce", url: "/_next/dynamic-css-manifest.json" },
        { revision: "100d0fc9b89fefd7", url: "/_next/static/chunks/1286-100d0fc9b89fefd7.js" },
        { revision: "ab664ab0189128b4", url: "/_next/static/chunks/1334-ab664ab0189128b4.js" },
        { revision: "80bd2565a3a97354", url: "/_next/static/chunks/151-80bd2565a3a97354.js" },
        { revision: "95205dc7b6e1bbb4", url: "/_next/static/chunks/1721-95205dc7b6e1bbb4.js" },
        { revision: "2d79ff41606832f1", url: "/_next/static/chunks/1816-2d79ff41606832f1.js" },
        { revision: "7f81e72435aa5f5c", url: "/_next/static/chunks/1981-7f81e72435aa5f5c.js" },
        { revision: "f272aa18c3fc029c", url: "/_next/static/chunks/2250-f272aa18c3fc029c.js" },
        { revision: "87dca2016f4c5c9a", url: "/_next/static/chunks/2750-87dca2016f4c5c9a.js" },
        { revision: "8897108d13db4a08", url: "/_next/static/chunks/3222-8897108d13db4a08.js" },
        { revision: "c9d9d5f9b18b75b4", url: "/_next/static/chunks/384-c9d9d5f9b18b75b4.js" },
        { revision: "0382c963f33bc858", url: "/_next/static/chunks/4274-0382c963f33bc858.js" },
        { revision: "de13331bd1497cd3", url: "/_next/static/chunks/4575-de13331bd1497cd3.js" },
        { revision: "9e45210c979ad1c0", url: "/_next/static/chunks/4761-9e45210c979ad1c0.js" },
        { revision: "bba0205a5c4e26ae", url: "/_next/static/chunks/4799-bba0205a5c4e26ae.js" },
        { revision: "aeadb0a8aefb16aa", url: "/_next/static/chunks/5211-aeadb0a8aefb16aa.js" },
        { revision: "ccfdc0210503b9ae", url: "/_next/static/chunks/5288-ccfdc0210503b9ae.js" },
        { revision: "60d702cd6c6bd725", url: "/_next/static/chunks/5545-60d702cd6c6bd725.js" },
        { revision: "d32e570720287b53", url: "/_next/static/chunks/6028-d32e570720287b53.js" },
        { revision: "eb9fb1caaf4466ce", url: "/_next/static/chunks/7169-eb9fb1caaf4466ce.js" },
        { revision: "190ca4dc8942f850", url: "/_next/static/chunks/719-190ca4dc8942f850.js" },
        { revision: "91ae43306b468863", url: "/_next/static/chunks/7882-91ae43306b468863.js" },
        { revision: "1c1168f6f7ffe373", url: "/_next/static/chunks/7963-1c1168f6f7ffe373.js" },
        { revision: "af2dae2395fcd175", url: "/_next/static/chunks/8220-af2dae2395fcd175.js" },
        { revision: "bc7bc28a68e5c0cb", url: "/_next/static/chunks/8281-bc7bc28a68e5c0cb.js" },
        { revision: "d15b48a27860393d", url: "/_next/static/chunks/901-d15b48a27860393d.js" },
        { revision: "77ef3818f82d373b", url: "/_next/static/chunks/9531-77ef3818f82d373b.js" },
        { revision: "6bc7fcb7e2204cfe", url: "/_next/static/chunks/framework-6bc7fcb7e2204cfe.js" },
        { revision: "9ae2c8caf64b6877", url: "/_next/static/chunks/main-9ae2c8caf64b6877.js" },
        { revision: "157bccf2197f8b14", url: "/_next/static/chunks/pages/404-157bccf2197f8b14.js" },
        {
          revision: "4f22da4e6295390e",
          url: "/_next/static/chunks/pages/_app-4f22da4e6295390e.js",
        },
        {
          revision: "e1885fccfb5197bd",
          url: "/_next/static/chunks/pages/_error-e1885fccfb5197bd.js",
        },
        {
          revision: "5585b406bb64d885",
          url: "/_next/static/chunks/pages/activity-5585b406bb64d885.js",
        },
        {
          revision: "c663f2e37f94f261",
          url: "/_next/static/chunks/pages/activity/%5BplaceId%5D-c663f2e37f94f261.js",
        },
        {
          revision: "f35688f1d6adf2ab",
          url: "/_next/static/chunks/pages/activity/%5BplaceId%5D/records/%5BuserId%5D-f35688f1d6adf2ab.js",
        },
        {
          revision: "236d343673a487ec",
          url: "/_next/static/chunks/pages/admin-236d343673a487ec.js",
        },
        {
          revision: "e51fd5c4e077d1fa",
          url: "/_next/static/chunks/pages/admin/activity-e51fd5c4e077d1fa.js",
        },
        {
          revision: "b286f72565e16cf0",
          url: "/_next/static/chunks/pages/admin/budget-b286f72565e16cf0.js",
        },
        {
          revision: "11b60e39958d884b",
          url: "/_next/static/chunks/pages/admin/budget/%5Bid%5D-11b60e39958d884b.js",
        },
        {
          revision: "15733bf220889aa6",
          url: "/_next/static/chunks/pages/admin/grade-update-15733bf220889aa6.js",
        },
        {
          revision: "dfba3a74a2561689",
          url: "/_next/static/chunks/pages/admin/group-dfba3a74a2561689.js",
        },
        {
          revision: "2a5cac81a0fc9e1f",
          url: "/_next/static/chunks/pages/admin/group/%5Bid%5D-2a5cac81a0fc9e1f.js",
        },
        {
          revision: "895fc44b3cfa1bcf",
          url: "/_next/static/chunks/pages/admin/group/new-895fc44b3cfa1bcf.js",
        },
        {
          revision: "21b9c7e93f9e37ed",
          url: "/_next/static/chunks/pages/admin/infra-21b9c7e93f9e37ed.js",
        },
        {
          revision: "b712c6445769fa1c",
          url: "/_next/static/chunks/pages/admin/payment-b712c6445769fa1c.js",
        },
        {
          revision: "c8bbc8de099fcd7b",
          url: "/_next/static/chunks/pages/admin/reentry-c8bbc8de099fcd7b.js",
        },
        {
          revision: "3f95d4d77a653801",
          url: "/_next/static/chunks/pages/budget-3f95d4d77a653801.js",
        },
        {
          revision: "85c771a8d00cd69d",
          url: "/_next/static/chunks/pages/budget/%5Bid%5D-85c771a8d00cd69d.js",
        },
        {
          revision: "5168329efae3c300",
          url: "/_next/static/chunks/pages/budget/%5Bid%5D/edit-5168329efae3c300.js",
        },
        {
          revision: "5408e2bc8bac7870",
          url: "/_next/static/chunks/pages/budget/my-5408e2bc8bac7870.js",
        },
        {
          revision: "66ef81f423e8fae3",
          url: "/_next/static/chunks/pages/event-66ef81f423e8fae3.js",
        },
        {
          revision: "05cbb1fd385528d0",
          url: "/_next/static/chunks/pages/event/%5Bid%5D-05cbb1fd385528d0.js",
        },
        {
          revision: "d78ab4757a451a0c",
          url: "/_next/static/chunks/pages/index-d78ab4757a451a0c.js",
        },
        {
          revision: "bfe31f30d1b4acc9",
          url: "/_next/static/chunks/pages/login-bfe31f30d1b4acc9.js",
        },
        {
          revision: "1d5e4147347aab59",
          url: "/_next/static/chunks/pages/login/callback-1d5e4147347aab59.js",
        },
        {
          revision: "d5b20a7a9426939c",
          url: "/_next/static/chunks/pages/login/reentry-d5b20a7a9426939c.js",
        },
        {
          revision: "2c1b98fd2d5635bf",
          url: "/_next/static/chunks/pages/member-2c1b98fd2d5635bf.js",
        },
        {
          revision: "a25a380b37a979c0",
          url: "/_next/static/chunks/pages/member/%5Bid%5D-a25a380b37a979c0.js",
        },
        {
          revision: "238ccef87fe5fab2",
          url: "/_next/static/chunks/pages/payment-238ccef87fe5fab2.js",
        },
        {
          revision: "e9ab6589eb17a8d5",
          url: "/_next/static/chunks/pages/register/discord-e9ab6589eb17a8d5.js",
        },
        {
          revision: "8836e647433892dd",
          url: "/_next/static/chunks/pages/register/introduction-8836e647433892dd.js",
        },
        {
          revision: "df7e28b769114c87",
          url: "/_next/static/chunks/pages/register/joined-df7e28b769114c87.js",
        },
        {
          revision: "297250d62ce94042",
          url: "/_next/static/chunks/pages/register/personal-297250d62ce94042.js",
        },
        {
          revision: "4fe2bd8ac6e274f8",
          url: "/_next/static/chunks/pages/register/public-4fe2bd8ac6e274f8.js",
        },
        {
          revision: "1f5ff346c0bbe550",
          url: "/_next/static/chunks/pages/setting-1f5ff346c0bbe550.js",
        },
        {
          revision: "f638ecb08ed28ab3",
          url: "/_next/static/chunks/pages/signup-f638ecb08ed28ab3.js",
        },
        {
          revision: "ef4f36fd9ea82db6",
          url: "/_next/static/chunks/pages/signup/callback-ef4f36fd9ea82db6.js",
        },
        {
          revision: "05fa30feabd08557",
          url: "/_next/static/chunks/pages/tutorial/club-fee-05fa30feabd08557.js",
        },
        {
          revision: "eafab680f38d57af",
          url: "/_next/static/chunks/pages/tutorial/discord-eafab680f38d57af.js",
        },
        {
          revision: "768c4024b6990a5f",
          url: "/_next/static/chunks/pages/tutorial/discord-server-768c4024b6990a5f.js",
        },
        {
          revision: "bf4faa13a10705b8",
          url: "/_next/static/chunks/pages/tutorial/introduction-bf4faa13a10705b8.js",
        },
        {
          revision: "f9a7b4b0779ea6d9",
          url: "/_next/static/chunks/pages/tutorial/joined-f9a7b4b0779ea6d9.js",
        },
        {
          revision: "a36ae5930787168b",
          url: "/_next/static/chunks/pages/tutorial/mattermost-app-a36ae5930787168b.js",
        },
        {
          revision: "dda31f7a3a49b5ba",
          url: "/_next/static/chunks/pages/tutorial/mattermost-dda31f7a3a49b5ba.js",
        },
        {
          revision: "8cda976d0729ebe0",
          url: "/_next/static/chunks/pages/tutorial/personal-info-8cda976d0729ebe0.js",
        },
        {
          revision: "07fa9daab839472b",
          url: "/_next/static/chunks/pages/tutorial/public-profile-07fa9daab839472b.js",
        },
        {
          revision: "d519ff9cf10cb5a3",
          url: "/_next/static/chunks/pages/tutorial/welcome-d519ff9cf10cb5a3.js",
        },
        {
          revision: "d8ca246d474bb265",
          url: "/_next/static/chunks/pages/user/discord/callback-d8ca246d474bb265.js",
        },
        {
          revision: "142bdf5ea00a6899",
          url: "/_next/static/chunks/pages/user/form/payment-142bdf5ea00a6899.js",
        },
        {
          revision: "c01c4426c8882584",
          url: "/_next/static/chunks/pages/user/profile-c01c4426c8882584.js",
        },
        {
          revision: "ca022e487153bafc",
          url: "/_next/static/chunks/pages/user/profile/discord-ca022e487153bafc.js",
        },
        {
          revision: "d9de70ebeae48f9b",
          url: "/_next/static/chunks/pages/user/profile/emergency-d9de70ebeae48f9b.js",
        },
        {
          revision: "291d10feeffd2913",
          url: "/_next/static/chunks/pages/user/profile/introduction-291d10feeffd2913.js",
        },
        {
          revision: "30df9a522a963729",
          url: "/_next/static/chunks/pages/user/profile/other-30df9a522a963729.js",
        },
        {
          revision: "8ba8c6b2a0d5fcac",
          url: "/_next/static/chunks/pages/user/profile/personal-8ba8c6b2a0d5fcac.js",
        },
        {
          revision: "16565538b389cf03",
          url: "/_next/static/chunks/pages/user/profile/public-16565538b389cf03.js",
        },
        {
          revision: "74ce2bd77a5b9979",
          url: "/_next/static/chunks/pages/work-74ce2bd77a5b9979.js",
        },
        {
          revision: "cc243391a2fb21ec",
          url: "/_next/static/chunks/pages/work/%5Bid%5D-cc243391a2fb21ec.js",
        },
        {
          revision: "c6459029fe4d87b8",
          url: "/_next/static/chunks/pages/work/mywork-c6459029fe4d87b8.js",
        },
        {
          revision: "2008ab39c3607c65",
          url: "/_next/static/chunks/pages/work/new-2008ab39c3607c65.js",
        },
        {
          revision: "3be9cd49fa75bb94",
          url: "/_next/static/chunks/pages/work/tag-3be9cd49fa75bb94.js",
        },
        {
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
        },
        { revision: "345555e3c489773c", url: "/_next/static/chunks/webpack-345555e3c489773c.js" },
        { revision: "b597964686d68c95", url: "/_next/static/css/b597964686d68c95.css" },
        {
          revision: "e3a7bc8c0ec8f60d7251bc7b205525f8",
          url: "/_next/static/zcBzpocnqj5IEemG6a8LD/_buildManifest.js",
        },
        {
          revision: "b6652df95db52feb4daf4eca35380933",
          url: "/_next/static/zcBzpocnqj5IEemG6a8LD/_ssgManifest.js",
        },
        { revision: "3039f913160b37fa7464e66bc66e5ae3", url: "/apple-touch-icon.png" },
        { revision: "8ab9dd0d6dfcca9e8409411c419f1c5e", url: "/favicon.ico" },
        { revision: "141b933b4c882a08edadfe4e7397b743", url: "/favicon.svg" },
        { revision: "2cd65a2e85c72abeddf340ee1de95c1f", url: "/icon_pwa-192x192.png" },
        { revision: "4bc2cc1627233be7ec0723d56b289510", url: "/icon_pwa-512x512.png" },
        { revision: "463053ba30711f4d07110742f11afebf", url: "/image/digicore_logo_type.svg" },
        { revision: "5f4709b74bb37a3dd3857743691ed8d2", url: "/image/fileicon/android.svg" },
        { revision: "cefed4f680b6b54984c0afe2e08eee50", url: "/image/fileicon/discord.svg" },
        {
          revision: "2f9407c9fa125c4c692f15d503fd0bc0",
          url: "/image/fileicon/microsoft-excel.svg",
        },
        {
          revision: "a6fbf8aa07d8643153d1f7f0c03dbcfc",
          url: "/image/fileicon/microsoft-powerpoint.svg",
        },
        { revision: "f70e0c21213b220d1910c10c0638944f", url: "/image/fileicon/microsoft-word.svg" },
        { revision: "73560fd2ba142612a2a688fe79d3be06", url: "/image/fileicon/windows-11.svg" },
        { revision: "2cf7f9cab14a0ae76f0814bd59384000", url: "/image/mattermost_icon.png" },
        { revision: "7a522cbf807c332444550d1314456881", url: "/image/mattermost_logo.png" },
        { revision: "23658bcf5244b305e59dd920348db1ef", url: "/image/mattermost_screen.png" },
        { revision: "4df4e0070c63b436848233920d334c66", url: "/manifest.json" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, { headers: e.headers, status: 200, statusText: "OK" })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 31536e3, maxEntries: 4 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 604800, maxEntries: 4 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 604800, maxEntries: 4 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 2592e3, maxEntries: 64 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 64 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 64 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 48 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 16 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 86400, maxEntries: 32 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 3600, maxEntries: 32 })],
      }),
      "GET",
    ));
});
