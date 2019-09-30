import React, { Component } from "react";
import schoolContract from "../ethereum/schoolContract";
import { Link } from "../routes";
import {
  Card,
  Grid,
  Button,
  Container,
  GridRow,
  Icon,
  Segment,
  GridColumn
} from "semantic-ui-react";
import web3 from "../ethereum/web3";

class SchoolDashboard extends Component {
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
      const students = await schoolContract.methods
        .getStudents(accounts[0])
        .call();
      this.setState({
        students: students,
        account: accounts[0],
        loading: false
      });
      console.log(this.state);
    } catch (err) {
      console.log(err.message);
    }
  };

  renderStudents = () => {
    const students = this.state.students;

    const items = students.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/upload/${address}`}>
            <a>Upload transcript</a>
          </Link>
        ),
        fluid: true
      };
    });

    return (
      <GridColumn width={6}>
        <Card.Group items={items} />
      </GridColumn>
    );
  };

  render() {
    return (
      <Container>
        <Segment loading={this.state.loading}>
          <Grid style={{ paddingLeft: "20px" }}>
            <GridRow>
              <GridColumn width={10}>
                <h2>School ID: {this.state.account}</h2>
              </GridColumn>
              <GridColumn width={6}>
                <Link route='/addStudents'>
                  <Button
                    color='green'
                    floated='right'
                    icon
                    labelPosition='left'>
                    <div>Add Students</div>
                    <Icon name='plus' />
                  </Button>
                </Link>
              </GridColumn>
            </GridRow>

            <GridRow style={{ justifyContent: "center" }}>
              <h4>Students studying in this school</h4>
            </GridRow>
            <GridRow>
              <div>{this.renderStudents()}</div>
            </GridRow>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

export default SchoolDashboard;
