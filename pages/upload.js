import React, { Component } from "react";
import UploadForm from "../components/UploadForm";
import Layout from "../components/Layout";

class UploadDoc extends Component {
  static getInitialProps(props) {
    return {
      studentId: props.query.address
    };
  }

  render() {
    return (
      <Layout>
        <UploadForm studentId={this.props.studentId} />
      </Layout>
    );
  }
}

export default UploadDoc;
