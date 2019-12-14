import { NextPage } from "next";
import Router from "next/router";

const RedirectPage: NextPage = () => {
  return null;
};

RedirectPage.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(302, {
      Location: "/surveys",
    });
    res.end();
  } else {
    Router.push("/surveys");
  }
  return {};
};

export default RedirectPage;
