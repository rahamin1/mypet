import React from 'react';
import { connect } from 'react-redux';
import { signOutUser, verifyAuth } from '../../actions/actions_auth';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class NavBooks extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.authInfo = this.authInfo.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    this.props.verifyAuth();
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" style={{ backgroundColor: "#dee7f4" }}>
          <NavbarBrand tag={Link} to="/"
            style={{ background: "transparent", padding: "3px",
            border: "1px solid purple" }}>
            <img src="/assets/images/book_lover.png" alt="book-lover!" />
          </NavbarBrand>

            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="#"
                  onClick={ () =>
                    this.props.signOutUser(this.props.history) }>
                  {this.authInfo()}
                </NavLink>
              </NavItem>
            </Nav>

        <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.loginEmail && <NavItem>
                <NavLink tag={Link} to="/cats">Book-Categories</NavLink>
              </NavItem>}
              <NavItem>
                <NavLink tag={Link} to="/howto">How-To-Use-This-Site</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/about">About</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <hr />
      </div>
    );
  }

  authInfo() {
    let authData = "";
    const loginEmail = this.props.loginEmail;
    if (this.props.loginEmail)
      authData = "Sign Out (<" + loginEmail + ">)";

    return (
      <div>{authData}</div>
    );
  }
}

function mapStateToProps(state) {
	return {
		loginEmail: state.auth.loginEmail
	};
}

export default connect(mapStateToProps,
	{ signOutUser, verifyAuth })(NavBooks);
