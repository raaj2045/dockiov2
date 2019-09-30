import React, { Component } from "react";

import { Link } from "../routes";

import { Menu, Segment } from "semantic-ui-react";

class Header extends Component {
  render() {
    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Link to='/'>
            <Menu.Item name='Home' />
          </Link>
        </Menu>
      </Segment>
    );
  }
}

export default Header;
