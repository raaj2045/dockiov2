import React, { Component } from "react";
import Layout from "../components/Layout";
import AddStudents from "../components/AddStudents";
import { Link } from "../routes";
class DockioIndex extends Component {
  render() {
    return (
      <Layout>
        <AddStudents />
      </Layout>
    );
  }
}

export default DockioIndex;
