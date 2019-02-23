import React, { Component } from 'react';
import { SafeAreaView, Image, View } from 'react-native';
import { connect } from 'react-redux';

import { AppLoading } from 'expo';
import {
  Container, Content, Form, Item, Input, Label, Icon, Button, Text, Spinner
} from 'native-base';

import { loginUser, signoutUser, facebookLogin, checkLoginState } from '../../actions';
import { icon } from '../../constants/miscConstants';
import styles from './styles';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValid: true,
      password: '',
      passwordValid: true,

      inputInProcess: false,

      isLoading: true
    };

    this.renderLoginForm = this.renderLoginForm.bind(this);

    this.onEmailFocus = this.onEmailFocus.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onEmailBlur = this.onEmailBlur.bind(this);
    this.emailValidity = this.emailValidity.bind(this);

    this.onPasswordFocus = this.onPasswordFocus.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordBlur = this.onPasswordBlur.bind(this);
    this.passwordValidity = this.passwordValidity.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formValidity = this.formValidity.bind(this);
  }

  static navigationOptions = {
    headerStyle: { backgroundColor: '#961d10' },
    headerLeft: <Text onPress={() =>
      this.props.navigation.openDrawer()}>Menu</Text>,
    title: 'Log in',
    headerTintColor: 'white'
  };

  async componentDidMount() {
    const { fbToken, fbUser, fbExpires } = this.props;
    await this.props.checkLoginState(fbToken, fbUser, fbExpires);
    this.setState({ isLoading: false });
  }

  componentWillReceiveProps(/*nextProps*/) {
    console.log("************************************");
    console.log("********* In LoginScreen/componentWillReceiveProps");
    /* TODO: Is this needed? Why?
    // check if already logged-in
    if (!nextProps.checkAuthInProcess) {
      const { fbToken, fbUser, fbExpires } = this.props;
      if (nextProps.email !== '' ||
        checkLoginState(fbToken, fbUser, fbExpires)) {
        nextProps.navigation.navigate('Main');
      }
    }
    */
  }

  render() {
    if (this.props.checkAuthInProcess || this.state.isLoading) {
      return (
        <AppLoading />
      );
    }

    // once login status has been checked, if user is logged in already
    // we go to the Main Tab (otherwise we continue to render the
    // login screen)
    if (this.props.userId !== '') {
      this.props.navigation.navigate('Main');
      return null;
    } else { // user is not logged-in
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Container style={styles.container}>
            <Content padder>

              {this.renderLogo()}
              {this.renderLoginForm()}
              {this.renderForgotSignup()}

              {this.renderSocial()}

            </Content>
          </Container>
        </SafeAreaView>
      );
    }
  }

  renderLoginForm() {
    return (
      <Form style={{ flex: 1, alignItems: 'center',
        marginLeft: 50, marginRight: 50 }}>
        <Item>
          <Label>Email</Label>
          <Input
            keyboardType="email-address"
            placeholder="user@gmail.com"
            value={this.state.email}
            textContentType="emailAddress"
            onChangeText={(text) => this.onEmailChange(text)}
            onBlur={this.onEmailBlur}
            onFocus={this.onEmailFocus}
          />
          { !this.state.emailValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>
        <Item last>
          <Label>Password</Label>
          <Input
            secureTextEntry
            label="Password"
            placeholder="password"
            value={this.state.password}
            textContentType="password"
            onChangeText={(text) => this.onPasswordChange(text)}
            onBlur={this.onPasswordBlur}
            onFocus={this.onPasswordFocus}
          />
          { !this.state.passwordValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>
        { !this.state.errorMsg !== '' && !this.state.inputInProcess &&
          <Text style={{ color: 'red', fontStyle: 'italic' }}>
            {this.state.errorMsg}
          </Text> }

        {this.renderError()}
        {this.renderButtonOrSpinner()}

      </Form>
    );
  }

  renderButtonOrSpinner() {
    if (!this.state.inputInProcess && this.props.loginInProcess) {
      return (
        <Spinner color="blue" />
      );
    } else {
      return (
        <Button style={styles.button} success block
          onPress={this.onSubmitForm.bind(this)}>
          <Text>Log in</Text>
        </Button>
      );
    }
  }

  renderSocial() {
    return null;
    /*
      (
        facebook login is implemented.
          However, need to implement firebase auth for it,
          which requires creating a user for logged-in facebook
          user in firebase

        <View style={{ marginTop: 30 }}>
        <Button style={styles.button}
          primary block iconLeft
          onPress={this.props.facebookLogin}>
          <Icon name='logo-facebook' />
          <Text>Log in with Facebook</Text>
        </Button>

        <Button style={styles.button}
          danger block iconLeft
          onPress={() => console.warn('Not implemented')}>
          <Icon name='logo-google' />
          <Text>Log in with Google</Text>
        </Button>
      </View>
    );
    */
  }

  renderLogo() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          square
          style={{ height: 150, width: 150, marginTop: 50 }}
          source={icon}
        />
      </View>
    );
  }

  renderForgotSignup() {
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{ color: 'blue', fontWeight: 'bold', fontStyle: 'italic' }}
            onPress={() =>
              this.props.navigation.navigate('ForgottenPassword')}>
            Forgot Password?
          </Text>
        </View>

        <Text style={{ alignSelf: 'center' }}>
          New to My Pet?{' '}
          <Text
            style={{ color: 'blue', fontWeight: 'bold' }}
            onPress={() =>
              this.props.navigation.navigate('Signup')}>
            Sign Up
          </Text>
        </Text>
      </View>
    );
  }

  renderError() {
    if (!this.state.inputInProcess && this.props.loginError) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.loginError}
          </Text>
        </View>
      );
    }
  }

  // email functions

  onEmailFocus() {
    this.setState( { emailValid: true,
        inputInProcess: true });
  }

  onEmailChange(text) {
    this.setState( { email: text, inputInProcess: true });
  }

  onEmailBlur() {
    this.emailValidity();
  }

  emailValidity() {
    const emailFilter =
// eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = (this.state.email !== '') &&
      emailFilter.test(this.state.email);

    this.setState({ emailValid: valid });
    return valid;
  }

  // password functions

  onPasswordFocus() {
    this.setState( { passwordValid: true,
        inputInProcess: true });
  }

  onPasswordChange(text) {
    this.setState( { password: text, inputInProcess: true });
  }

  onPasswordBlur() {
    // this.passwordValidity();
  }

  passwordValidity() {
    const valid = (this.state.password.replace(/\s/g, '').length !== 0);

    this.setState(() => ({ passwordValid: valid }));
    return valid;
  }

  onClearForm(e) {
		e.preventDefault();
		this.setState({
			email: '',
			emailValid: true,
			inputInProcess: true,
      errorMsg: ''
		});
	}

	onSubmitForm() {

		const formPayload = {
			email: this.state.email,
      password: this.state.password
		};
    this.setState({ inputInProcess: false });
		if (!this.formValidity()) {
			return false;
		}

    this.props.loginUser(formPayload, this.props.navigation);
	}

	formValidity() {
    let errorMsg = "";
    let formValid = true;

    if (!this.emailValidity()) {
      formValid = false;
      errorMsg = (this.state.email === '') ?
        "Email value cannot be empty" :
        "Error in email value";
    }

    if (!this.passwordValidity()) {
      formValid = false;
      errorMsg = (errorMsg === "") ?
      "Password value cannot be empty" :
      errorMsg + "; Password value cannot be empty";
    }

    this.setState({ errorMsg: errorMsg });
		return formValid;
	}
}

const mapStateToProps = state => {
  const { userId, fbToken, fbUser, fbExpires,
    loginError, loginInProcess, checkAuthInProcess } = state.auth;
  return {
    userId, fbToken, fbUser, fbExpires,
    loginError, loginInProcess, checkAuthInProcess
  };
};

export default connect(mapStateToProps,
  { loginUser, signoutUser, facebookLogin, checkLoginState })(LoginScreen);
