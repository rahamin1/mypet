import React, { Component } from 'react';
import { SafeAreaView, Image, View } from 'react-native';
import { connect } from 'react-redux';

import {
  Container, Content, Form, Item, Input, Label, Icon, Button, Text, Spinner
} from 'native-base';

import { signupUser, signoutUser } from '../../actions';
import { icon } from '../../constants/miscConstants';
import styles from './styles';

class SignupScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValid: true,
      password: '',
      passwordValid: true,

      inputInProcess: false
    };

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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Content padder>
            {/* <Content padder contentContainerStyle={styles.content}> */}
            <Form style={{ flex: 1, alignItems: 'center', margin: 50 }}>
              <Image
                square
                style={{ height: 150, width: 150, marginTop: 50 }}
                source={icon}
              />
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

            <Text style={{ alignSelf: 'center' }}>
              Already signed up?{' '}
              <Text
                style={{ color: 'blue', fontWeight: 'bold' }}
                onPress={() =>
                  this.props.navigation.navigate('Login')}>
                Log in
              </Text>
            </Text>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderButtonOrSpinner() {
    if (!this.state.inputInProcess && this.props.signupInProcess) {
      return (
        <Spinner color="blue" />
      );
    } else {
      return (
        <Button style={styles.button} success block
          onPress={this.onSubmitForm.bind(this)}>
          <Text>Sign up</Text>
        </Button>
      );
    }
  }

  renderError() {
    if (!this.state.inputInProcess && this.props.signupError) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.signupError}
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

    this.props.signupUser(formPayload, this.props.navigation);
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

/*
render() {
  return (
    <Card>
      <CardSection>
        <MyInput
          label="Email"
          keyboardType="email-address"
          placeholder="email@gmail.com"
          value={this.props.email}
          onChangeText={(text) => this.onEmailChange.bind(this)(text)}
        />
      </CardSection>
      <CardSection>
        <MyInput
          secureTextEntry
          label="Password"
          placeholder="password"
          value={this.props.password}
          onChangeText={(text) =>
            this.onPasswordChange.bind(this)(text)}
        />
      </CardSection>

      {this.renderError()}

      <CardSection>
        {this.renderButtonOrSpinner()}
      </CardSection>
    </Card>
  );
}

*/

/*
const styles = {
errorTextStyle: {
  alignSelf: "center",
  color: "red",
  fontSize: 20
}
};

*/

const mapStateToProps = state => {
const { signupError, signupInProcess } = state.auth;
return {
  signupError, signupInProcess
};
};

export default connect(mapStateToProps, { signupUser, signoutUser })(SignupScreen);
