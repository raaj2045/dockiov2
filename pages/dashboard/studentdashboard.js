import React, { Component } from "react";
import StudentDashboard from "../../components/StudentDashboard";
import Layout from "../../components/Layout";
class studentIndex extends Component {
  render() {
    return (
      <Layout>
        <StudentDashboard />
      </Layout>
    );
  }
}

export default studentIndex;
