import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView, View, Image, Modal } from "react-native";
import { ImagePicker, Permissions } from 'expo';
import {
  Container, Body, Content, Header, Left, Right,
  Icon, Card, CardItem, Thumbnail,
  Title, Button, Text, Form, Item, Input, Label, Spinner, DatePicker
} from "native-base";
import { logo } from 'mypet/constants/miscConstants';
import { petFetch, petUpdate } from 'mypet/actions';
import styles from './styles';

const initialState = {
  helpModalVisible: false,

  name: '',
  nameValid: true,
  birthday: new Date(),
  photo: '',
  notes: '',
  notesValid: true,
  inputInProcess: false
};

class Pet extends React.Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = { ...initialState };

    this.setDate = this.setDate.bind(this);
    this.renderForm = this.renderForm.bind(this);

    this.onNameFocus = this.onNameFocus.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNameBlur = this.onNameBlur.bind(this);
    this.nameValidity = this.nameValidity.bind(this);

    this.onNotesFocus = this.onNotesFocus.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.onNotesBlur = this.onNotesBlur.bind(this);
    this.notesValidity = this.notesValidity.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formValidity = this.formValidity.bind(this);

    this.pickImage = this.pickImage.bind(this);
  }

  componentDidMount() {
    this.props.petFetch(this.props.auth.userId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pet.name !== prevProps.pet.name) {
      let { birthday } = this.props.pet;
      const { name, notes, photo } = this.props.pet;

      // convert date to a Date object which is required by DatePicker
      if (!birthday || birthday === '')
        birthday = new Date();
      else {
        birthday = new Date(birthday);
      }

      this.setState({ name, birthday, notes, photo });
    }
  }


  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('Main')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>My Pet Details</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => this.setHelpModalVisible(true)}>
                <Icon name="md-help" />
              </Button>
            </Right>
          </Header>
          <Content padder style={styles.content}>
            <Card>
              {this.renderForm.bind(this)()}
            </Card>
            {this.help()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderForm() {

    const { fetchInProgress } = this.props.pet;

    if (fetchInProgress) {
      return (
        <View style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
        </View>
      );
    }

    return (
      <CardItem>
        <Form style={{ flex: 1, alignItems: 'flex-start', borderWidth: 0 }}>

          <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
            <Label>Name:</Label>
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

          <Item style={{ flexDirection: 'column', alignItems: 'flex-start',
             marginBottom: 10, paddingLeft: 0, marginLeft: 0 }}>
            <DatePicker
              defaultDate={this.state.birthday}
              locale={"en"}
              timeZoneOffsetInMinutes={0}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Click here to change the birth date"
              textStyle={{ color: "#d3d3d3" }}
              placeHolderTextStyle={{ color: "#b3b3b3", fontSize: 16, fontStyle: 'italic' }}
              onDateChange={this.setDate}
              />
            <Text style={{ paddingLeft: 0, marginLeft: 0 }}>
              Birth date: {this.state.birthday.toString().substr(4, 12)}
            </Text>
          </Item>

          <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
            <Label>Notes:</Label>
            <Input
              block
              style={{ height: 100 }}
              multiline={true}
              keyboardType="default"
              label="Notes"
              placeholder="Enter notes (if any)..."
              value={this.state.notes}
              textContentType="none"
              onChangeText={(text) => this.onNotesChange(text)}
              onBlur={this.onNotesBlur}
              onFocus={this.onNotesFocus}
            />
            { !this.state.notesValid &&
              <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
          </Item>

          <Button style={[styles.button, { marginBottom: 10 }]}
            bordered success block
            onPress={this.pickImage}>
            <Text>Load Pet's Profile Photo</Text>
          </Button>

          <Button style={[styles.button, { marginBottom: 10 }]}
            danger block
            onPress={this.pickPhoto}>
            <Text>Take Photo - DOES NOT WORK</Text>
          </Button>

          { !this.state.errorMsg !== '' && !this.state.inputInProcess &&
            <Text style={{ color: 'red', fontStyle: 'italic' }}>
              {this.state.errorMsg}
            </Text> }

          <CardItem last style={{ flex: 1, marginBottom: 10 }}>
            { this.state.photo !== '' &&
            <Image source={{ uri: this.state.photo }}
            style={{ height: 200, width: 200, flex: 1 }}/> }
          </CardItem>

          {this.renderError()}
          {this.renderButtonOrSpinner()}

        </Form>
      </CardItem>
    );
  }

  pickImage = async() => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
      exif: true
    });
    if (!result.cancelled) {
      this.setState({
        photo: result.uri
      });
    }
  }

  pickPhoto = async() => {
    let { status } = await Permissions.getAsync(Permissions.CAMERA);
    console.log('status of Camera permission: ', status);
    if (status !== 'granted') {
      console.log('Camera permission not granted!');
      console.log('Asking for permission');
      status = await Permissions.askAsync(Permissions.CAMERA).status;
      if (status !== 'granted') {
        console.log('Asked for permission, but not granted!');
        return;
      } else {
        console.log('Cemera permission is granted!');
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true
    });
    if (!result.cancelled) {
      this.setState({
        photo: result.uri
      });
    }
    console.log('--- result of pickPhoto:');
    console.log(result.uri);
  }

  renderButtonOrSpinner() {
    if (this.props.pet.updateInProgress) {
      return (
        <CardItem>
          <Left />
          <Spinner color='#41b8f4' />
          <Right />
        </CardItem>
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
    const { updateError } = this.props.pet;
    if (!this.state.inputInProcess && updateError !== '') {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {updateError}
          </Text>
        </View>
      );
    }
  }

  // date function
  setDate(newDate) {
    this.setState({ birthday: newDate });
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

  // notes functions

  onNotesFocus() {
    this.setState( { notesValid: true,
        inputInProcess: true });
  }

  onNotesChange(text) {
    this.setState( { notes: text, inputInProcess: true });
  }

  onNotesBlur() {
    this.notesValidity();
  }

  notesValidity() {
    // const notesFilter = /^[a-zA-Z0-9\s]*$/;
    // const valid = (this.state.notes !== '');
    // notesFilter.test(this.state.notes);

    //currently, always valid
    const valid = true;

    this.setState(() => ({ notesValid: valid }));
    return valid;
  }

  // photo function

  photoValidity() {
    const valid = (this.state.photo !== '');

    this.setState(() => ({ photoValid: valid }));
    return valid;
  }

  onClearForm(e) {
		e.preventDefault();
		this.setState({ ...initialState });
	}

	onSubmitForm() {

    const { name, notes, photo } = this.state;
    let { birthday } = this.state;

    // convert the date object to number of seconds since 1/1/1970
    // to be stored in firebase (Date object cannot be stored)
    if (!birthday || birthday === '')
      birthday = new Date().getTime();
    else
      birthday = new Date(birthday).getTime();

		const formPayload = { name, birthday, notes, photo };
    const curPhoto = this.props.pet.photo;

    this.setState({ inputInProcess: false });
		if (!this.formValidity()) {
			return false;
		}
    this.props.petUpdate(this.props.auth.userId, curPhoto, formPayload, this.props.navigation);
	}

	formValidity() {
    let errorMsg = "";
    let formValid = true;

    if (!this.nameValidity()) {
      formValid = false;
      errorMsg = (this.state.name === '') ?
        "You forgot to type your pet's name" :
        "Unknown error in name";
    }

    if (!this.notesValidity()) {
      formValid = false;
      errorMsg = (errorMsg === "") ?
      "Notes value cannot be empty" :
      errorMsg + "; Notes value cannot be empty";
    }

    if (!this.photoValidity()) {
      formValid = false;
      errorMsg = (errorMsg === "") ?
      "You must load a photo" :
      errorMsg + "; You must load a photo";
    }

    this.setState({ errorMsg: errorMsg });
		return formValid;
	}

  // Help-Modal functions
  setHelpModalVisible(visible) {
    this.setState({ helpModalVisible: visible });
  }

  help() {
    return (
       <SafeAreaView style={{ flex: 1, marginTop: 22 }}>

         <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.helpModalVisible}
            onRequestClose={() => {
              this.setHelpModalVisible(false);
            }}>
            <Content>
            <Card style={styles.marginAll}>
              <CardItem bordered>
                <Left>
                  <Thumbnail source={logo} />
                  <Body>
                    <Text>My Pet!</Text>
                    <Text note>Pet Details: Help</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-medkit" />
                <Text style={styles.textPadding}>
                  This is the page displaying... well, you know better than us what it displays :)
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-arrow-round-forward" />
                <Text style={styles.textPadding}>
                  Click on an item to view its details.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon name="ios-paper-outline" active style={{ color: '#888' }}/>
                <Text style={styles.textPadding}>
                  Click on this icon (displayed on the top right corner of
                    a photo) in order to modify it.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="ios-radio-button-off" style={{ fontSize: 12 }} />
                <Text style={styles.textPadding}>
                  Select one or more items by clicking on this icon (displayed on the top left
                  corner of the photo(s)) and then click on the trash icon at the top
                  right to delete these photos.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Button block onPress={() => {
                    this.setHelpModalVisible(false);
                  }}>
                    <Text>Close</Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
          </Modal>
       </SafeAreaView>
     );
  }
}

function mapStateToProps({ auth, pet }) {
  return { auth, pet };
}

export default connect(mapStateToProps, { petFetch, petUpdate })(Pet);
