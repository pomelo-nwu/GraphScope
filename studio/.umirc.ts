export default {
  base: "/",
  publicPath: "/",
  hash: true,
  favicon:
    "https://gw.alipayobjects.com/zos/bmw-prod/b9a0f537-3768-445d-aa39-ff49de82124a.svg",
  history: {
    type: "hash",
  },
  alias: {
    "@": "./src",
  },
  nodeModulesTransform: {
    type: "none",
  },
  routes: [
    { exact: true, path: "/", redirect: "/dataset/list" },
    {
      path: "/",
      component: "@/layouts/index",
      routes: [
        {
          path: "/dataset",
          component: "@/layouts/sidenav",
          routes: [
            {
              exact: true,
              path: "list",
              component: "dataset/table",
            },
          ],
        },
      ],
    },
  ],
};
