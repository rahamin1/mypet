import React from "react";
import { SafeAreaView, View, BackHandler } from "react-native";
import { connect } from 'react-redux';
import {
  Container, Body, Content, Header, Left, Right, Icon, Card, CardItem,
  Title, Button, Text, Form, Item, Input, Label, Spinner
} from "native-base";

import { contactUpdate, contactAdd } from '../../../actions';
import styles from '../styles';

class ContactEdit extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // item is null when adding a new item; otherwise editing an existing item
    const { item } = this.props.navigation.state.params;

    // const { photo, name, phone, mail, comments }

    const newItem = item ? false : true;
    const photo = item ? item.photo : '';
    const name = item ? item.name : '';
    const phone = item ? item.phone : '';
    const mail = item ? item.mail : '';
    const comments = item ? item.comments : '';
    const key = item ? item.key : null;

    this.state = {
      newItem,
      key,
      photo,
      name, nameValid: true,
      phone, phoneValid: true,
      mail, mailValid: true,
      comments, commentsValid: true,

      inputInProcess: false
    };

    this.renderContactForm = this.renderContactForm.bind(this);

    this.onNameFocus = this.onNameFocus.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNameBlur = this.onNameBlur.bind(this);
    this.nameValidity = this.nameValidity.bind(this);

    this.onPhoneFocus = this.onPhoneFocus.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onPhoneBlur = this.onPhoneBlur.bind(this);
    this.phoneValidity = this.phoneValidity.bind(this);

    this.onMailFocus = this.onMailFocus.bind(this);
    this.onMailChange = this.onMailChange.bind(this);
    this.onMailBlur = this.onMailBlur.bind(this);
    this.mailValidity = this.mailValidity.bind(this);

    this.onCommentsFocus = this.onCommentsFocus.bind(this);
    this.onCommentsChange = this.onCommentsChange.bind(this);
    this.onCommentsBlur = this.onCommentsBlur.bind(this);
    this.commentsValidity = this.commentsValidity.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formValidity = this.formValidity.bind(this);

    // this.pickImage = this.pickImage.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{navigation.state.params.item ? 'Edit Contact' : 'Add Contact'}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            <Card style={{ flex: 1, alignItems: 'flex-start' }}>
              <CardItem>
                {this.renderContactForm()}
              </CardItem>
            </Card>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderContactForm() {

    return (
      <Form style={{ flex: 1, alignItems: 'flex-start' }}>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label style={styles.textTitle}>Name:</Label>
          <Input
            multiline={false}
            keyboardType="default"
            label="Name"
            placeholder="Enter name..."
            value={this.state.name}
            textContentType="none"
            onChangeText={(text) => this.onNameChange(text)}
            onBlur={this.onNameBlur}
            onFocus={this.onNameFocus}
          />
          { !this.state.nameValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label style={styles.textTitle}>Phone:</Label>
          <Input
            multiline={false}
            keyboardType="phone-pad"
            label="Phone"
            placeholder="Enter phone..."
            value={this.state.phone}
            textContentType="none"
            onChangeText={(text) => this.onPhoneChange(text)}
            onBlur={this.onPhoneBlur}
            onFocus={this.onPhoneFocus}
          />
          { !this.state.phoneValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label style={styles.textTitle}>Mail:</Label>
          <Input
            multiline={false}
            keyboardType="email-address"
            label="Mail"
            placeholder="Enter mail..."
            value={this.state.mail}
            textContentType="none"
            onChangeText={(text) => this.onMailChange(text)}
            onBlur={this.onMailBlur}
            onFocus={this.onMailFocus}
          />
          { !this.state.mailValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>

        <Item last
          style={{ paddingLeft: 0, paddingBottom: 10,
            paddingTop: 10, marginLeft: 0 }}>
            <Label style={styles.textTitle}>Comments:</Label>
            <Input
              style={{ height: 100 }}
              multiline={true}
              keyboardType="default"
              label="Comments"
              placeholder="Enter comments..."
              value={this.state.comments}
              textContentType="none"
              onChangeText={(text) => this.onCommentsChange(text)}
              onBlur={this.onCommentsBlur}
              onFocus={this.onCommentsFocus}
            />
            { !this.state.commentsValid &&
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
    if (!this.state.inputInProcess && this.props.contactItemInProcess) {
      return (
        <Spinner color="blue" />
      );
    } else {
      return (
        <Button style={styles.button} success block
          onPress={this.onSubmitForm.bind(this)}>
          <Text>Submit</Text>
        </Button>
      );
    }
  }

  renderError() {
    // TODO define contactItemError
    if (!this.state.inputInProcess && this.props.contactItemError) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.contactItemError}
          </Text>
        </View>
      );
    }
  }

  // name functions

  onNameFocus() {
    this.setState( { nameValid: true,
        inputInProcess: true });
  }

  onNameChange(text) {
    this.setState( { name: text, inputInProcess: true });
  }

  onNameBlur() {
    this.nameValidity();
  }

  nameValidity() {
    // const nameFilter = /^[a-zA-Z0-9\s]*$/;
    const valid = (this.state.name !== '');
    // && nameFilter.test(this.state.name);

    this.setState({ nameValid: valid });
    return valid;
  }

  // phone functions

  onPhoneFocus() {
    this.setState( { phoneValid: true,
        inputInProcess: true });
  }

  onPhoneChange(text) {
    this.setState( { phone: text, inputInProcess: true });
  }

  onPhoneBlur() {
    this.phoneValidity();
  }

  phoneValidity() {
    const phoneFilter = /^[0-9\-+\s]*$/;
    const valid = (this.state.phone !== '') &&
      phoneFilter.test(this.state.phone);

    this.setState({ phoneValid: valid });
    return valid;
  }

  // mail functions

  onMailFocus() {
    this.setState( { mailValid: true,
        inputInProcess: true });
  }

  onMailChange(text) {
    this.setState( { mail: text, inputInProcess: true });
  }

  onMailBlur() {
    this.mailValidity();
  }

  mailValidity() {
     // eslint-disable-next-line
    const mailFilter = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const valid = (this.state.mail !== '') &&
      mailFilter.test(this.state.mail);

    this.setState({ mailValid: valid });
    return valid;
  }

  // comments functions

  onCommentsFocus() {
    this.setState( { commentsValid: true,
        inputInProcess: true });
  }

  onCommentsChange(text) {
    this.setState( { comments: text, inputInProcess: true });
  }

  onCommentsBlur() {
    this.commentsValidity();
  }

  commentsValidity() {
    // always true
    this.setState({ commentsValid: true });
    return true;
  }

  onClearForm(e) {
		e.preventDefault();
		this.setState({
      newItem: true,
      key: '',
      photo: '',
      name: '', nameValid: true,
      phone: '', phoneValid: true,
      mail: '', mailValid: true,
      comments: '', commentsValid: true,

      inputInProcess: false
		});
	}

	onSubmitForm() {

    const { key, name, photo, phone, mail, comments } = this.state;
    const curTime = Date.now();
		const formPayload = { key, curTime, name, photo, phone, mail, comments };

    this.setState({ inputInProcess: false });
		if (!this.formValidity()) {
			return false;
		}
    if (this.state.newItem) // ading a new item
      this.props.contactAdd(this.props.auth.userId, formPayload, this.props.navigation);
    else // editing an existing item
      this.props.contactUpdate(this.props.auth.userId, formPayload, this.props.navigation);
	}

	formValidity() {
    let errorMsg = "";
    let formValid = true;

    if (!this.nameValidity()) {
      formValid = false;
      errorMsg = (this.state.name === '') ?
        "Name value cannot be empty" :
        "Unknown error in name";
    }

    if (!this.phoneValidity()) {
      formValid = false;
      let phoneError = (this.state.phone === '') ?
        "Phone value cannot be empty" :
        "Phone value is incorrect (only digits and + allowed)";

      errorMsg = (errorMsg === "") ? // if not empty, append phone message
        phoneError : errorMsg + "; " + phoneError;
    }

    if (!this.mailValidity()) {
      formValid = false;
      let mailError = (this.state.mail === '') ?
        "Mail value cannot be empty" :
        "Mail value is incorrect";

      errorMsg = (errorMsg === "") ? // if not empty, append phone message
        mailError : errorMsg + "; " + mailError;
    }

    if (!this.commentsValidity()) {
      formValid = false;
      errorMsg = (errorMsg === "") ?
      "Comments value is incorrect" :
      errorMsg + "; Comments value is incorrect";
    }

    this.setState({ errorMsg: errorMsg });
		return formValid;
	}
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps,
  { contactUpdate, contactAdd })(ContactEdit);
