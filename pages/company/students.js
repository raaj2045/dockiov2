import React, { Component } from "react";
import companyContract from "../../ethereum/companyContract";
import { Link } from "../../routes";
import {
  Card,
  Grid,
  Button,
  Container,
  GridRow,
  Header
} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
class studentInfo extends Component {
  static getInitialProps(props) {
    return {
      schoolId: props.query.address,
      companyId: props.query.companyAddress
    };
  }
  state = {
    loading: true,
    account: "",
    students: []
  };

  componentDidMount() {
    this.getStudents();
  }

  getStudents = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const students = await companyContract.methods
        .getSchoolStudentAddresses(this.props.schoolId)
        .call();
      this.setState({ students: students, account: accounts[0] });
      console.log(this.state);
    } catch (err) {
      console.log(err.message);
    }
  };

  renderStudents = () => {
    const students = this.state.students;
    const companyAddress = this.state.account;
    const schoolAddress = this.props.schoolId;
    const items = students.map(address => {
      return {
        header: address,
        description: (
          <Link
            route={`/company/${companyAddress}/${schoolAddress}/${address}`}>
            <a>View</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  };

  render() {
    return (
      <Layout>
        <Container>
          <GridRow>
            <Header textAlign='center'>Students</Header>
            <div>{this.renderStudents()}</div>
          </GridRow>
        </Container>
      </Layout>
    );
  }
}

export default studentInfo;
