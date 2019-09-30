import React, { Component } from "react";
import SchoolDashboard from "../../components/SchoolDashboard";
import Layout from "../../components/Layout";
class schoolIndex extends Component {
  render() {
    return (
      <Layout>
        <SchoolDashboard />
      </Layout>
    );
  }
}

export default schoolIndex;
