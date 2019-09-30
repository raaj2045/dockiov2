import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import Login from "../components/Login";
import Head from "next/head";
import Layout from "../components/Layout";
class LoginPage extends Component {
  render() {
    return (
      <Layout>
        <Head>
          <link
            rel='stylesheet'
            href='//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css'
          />
        </Head>
        <Login />
      </Layout>
    );
  }
}

export default LoginPage;
