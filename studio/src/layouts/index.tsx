import "antd/dist/antd.css";
import * as React from "react";

import "./index.less";
interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = (props) => {
  //@ts-ignore
  const { children, location } = props;
  const active = location.pathname.split("/")[1];

  return (
    <>
      <div
        style={{
          background: "green",
          height: "48px",
          lineHeight: "48px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        GraphScope Studio
      </div>
      <div className="gi-layout-container">{children}</div>
    </>
  );
};

export default Layout;
