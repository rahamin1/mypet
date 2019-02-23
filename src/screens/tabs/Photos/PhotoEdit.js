import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView, View, Image, BackHandler } from "react-native";
import { ImagePicker, Permissions } from 'expo';
import {
  Container, Body, Content, Header, Left, Right, Icon, Card, CardItem,
  Title, Button, Text, Form, Item, Input, Label, Spinner, DatePicker
} from "native-base";
import { photoHeight } from '../../../constants/miscConstants';
import { photoUpdate, photoAdd } from '../../../actions';
import styles from '../styles';

class PhotoEdit extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // item is null when adding a new item; otherwise editing an existing item
    const { item } = this.props.navigation.state.params;

    const newItem = item ? false : true;
    // convert date to a Date object which is required by DatePicker
    let date = item ? new Date(item.itemDate) : new Date();
    const photo = item ? item.photo : '';
    const title = item ? item.title : '';
    const notes = item ? item.notes : '';
    const key = item ? item.key : null;

    this.state = {
      newItem,
      key,
      date,
      title,
      titleValid: true,
      notes,
      notesValid: true,
      photo,
      photoValid: true,

      inputInProcess: false
    };

    this.renderPhotoForm = this.renderPhotoForm.bind(this);

    this.setDate = this.setDate.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);

    this.onTitleFocus = this.onTitleFocus.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTitleBlur = this.onTitleBlur.bind(this);
    this.titleValidity = this.titleValidity.bind(this);

    this.onNotesFocus = this.onNotesFocus.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.onNotesBlur = this.onNotesBlur.bind(this);
    this.notesValidity = this.notesValidity.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formValidity = this.formValidity.bind(this);

    this.pickImage = this.pickImage.bind(this);
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
              <Title>{navigation.state.params.item ? 'Edit Photo' : 'Add Photo'}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            <Card style={{ flex: 1, alignItems: 'flex-start' }}>
              <CardItem>
                {this.renderPhotoForm()}
              </CardItem>
            </Card>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderPhotoForm() {

    return (
      <Form style={{ flex: 1, alignItems: 'flex-start' }}>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Text style={[styles.textPadding,
            { paddingBottom: 20, fontWeight: '400', color: 'red' }]}>
            Note: due to a bug that we are trying to resolve,
            it is impossible to save photos in the app.
            We are trying to solve this.
            We are sorry for the inconvenience.
          </Text>
        </Item>

        <Item style={{ flexDirection: 'column', marginBottom: 10, paddingLeft: 0, marginLeft: 0 }}>
          {/* minimumDate={new Date(2010, 1, 1)} */}
          {/* maximumDate={new Date(2028, 12, 31)}*/}
          <DatePicker
            defaultDate={this.state.date}
            locale={"en"}
            timeZoneOffsetInMinutes={0}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Click here to change the date"
            textStyle={{ color: "#d3d3d3" }}
            placeHolderTextStyle={{ color: "#b3b3b3", fontSize: 16, fontStyle: 'italic' }}
            onDateChange={this.setDate}
            />
            <Text style={{ paddingLeft: 0, marginLeft: 0 }}>
              <Text style={styles.textTitle}>Date: </Text>
              {this.state.date.toString().substr(4, 12)}
            </Text>
          </Item>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label style={styles.textTitle}>Title:</Label>
          <Input
            multiline={false}
            keyboardType="default"
            label="Title"
            placeholder="Enter title..."
            value={this.state.title}
            textContentType="none"
            onChangeText={(text) => this.onTitleChange(text)}
            onBlur={this.onTitleBlur}
            onFocus={this.onTitleFocus}
          />
          { !this.state.titleValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>

        <Item last
          style={{ paddingLeft: 0, paddingBottom: 10,
            paddingTop: 10, marginLeft: 0 }}>
          <Label style={styles.textTitle}>Notes:</Label>
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
          info block
          onPress={this.pickImage}>
          <Text>Load Photo</Text>
        </Button>

        <Button style={[styles.button, { marginBottom: 10 }]}
          info block
          onPress={this.pickPhoto}>
          <Text>Take Photo</Text>
        </Button>

        { !this.state.errorMsg !== '' && !this.state.inputInProcess &&
          <Text style={{ color: 'red', fontStyle: 'italic' }}>
            {this.state.errorMsg}
          </Text> }

        <CardItem last style={{ flex: 1, marginBottom: 10 }}>
          { this.state.photo !== '' &&
          <Image source={{ uri: this.state.photo }}
          style={{ height: photoHeight, width: null,
            resizeMode: 'contain', flex: 1 }}/> }
        </CardItem>

        {this.renderError()}
        {this.renderButtonOrSpinner()}

      </Form>
    );
  }

  pickImage = async() => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
      exif: true
    });
    if (!result.cancelled) {
      this.setState({
        photo: result.uri
      });
    }
    console.log('--- result of pickImage:');
    console.log(result.uri);
  }

  pickPhoto = async() => {
    let { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    console.log('status of Camera permission: ', status);
    if (status !== 'granted') {
      console.log('CAMERA and/or CAMERA_ROLL permissions not granted!');
      console.log('Asking for permission');
      let { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        console.log('Asked for permissions, but not granted!');
        return;
      } else {
        console.log('CAMERA and CAMERA_ROLL permissions are granted!');
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4.1, 3],
      quality: 0.1,
      base64: true,
      exif: true
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
    if (this.props.photo.addInProgress) {
      return (
        <CardItem>
          <Left />
          <Spinner color='#41b8f4' />
          <Right />
        </CardItem>
      );
    } else {
      return (
        <Button style={styles.button} primary block
          onPress={this.onSubmitForm.bind(this)}>
          <Text>Submit</Text>
        </Button>
      );
    }
  }

  renderError() {
    const { addInProcess, addError } = this.props.photo;
    if (!this.state.inputInProcess && !addInProcess && addError !== '') {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {addError}
          </Text>
        </View>
      );
    }
  }

  // date function
  setDate(newDate) {
    this.setState({ date: newDate });
    console.log('newDate: ', newDate);
  }

  // type function
  onTypeChange(value: string) {
    this.setState({ type: value });
  }

  // title functions

  onTitleFocus() {
    this.setState( { titleValid: true,
        inputInProcess: true });
  }

  onTitleChange(text) {
    this.setState( { title: text, inputInProcess: true });
  }

  onTitleBlur() {
    this.titleValidity();
  }

  titleValidity() {
    // const titleFilter = /^[a-zA-Z0-9\s]*$/;
    const valid = (this.state.title !== '');
    // && titleFilter.test(this.state.title);

    this.setState({ titleValid: valid });
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
		this.setState({
      newItem: true,
      date: new Date(),
      title: '',
      titleValid: true,
      notes: '',
      notesValid: true,
      photo: '',
      photoValid: true,

      inputInProcess: false
		});
	}

	onSubmitForm() {

    const { key, date, title, notes, photo } = this.state;
    const curTime = Date.now();
    const itemDate = new Date(date).getTime();

		const formPayload = { key, curTime, itemDate, title, notes, photo };

    this.setState({ inputInProcess: false });
		if (!this.formValidity()) {
			return false;
		}
    console.log(formPayload);
    if (this.state.newItem) // ading a new item
      this.props.photoAdd(this.props.auth.userId, formPayload, this.props.navigation);
    else // editing an existing item
      this.props.photoUpdate(this.props.auth.userId, formPayload, this.props.navigation);
	}

	formValidity() {
    let errorMsg = "";
    let formValid = true;

    if (!this.titleValidity()) {
      formValid = false;
      errorMsg = (this.state.title === '') ?
        "Title value cannot be empty" :
        "Unknown error in title";
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
      "You must load or take a photo" :
      errorMsg + "; You must load or take a photo";
    }

    this.setState({ errorMsg: errorMsg });
		return formValid;
	}
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    photo: state.photo
  };
};

export default connect(mapStateToProps,
  { photoUpdate, photoAdd })(PhotoEdit);
