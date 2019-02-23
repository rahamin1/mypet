import React from "react";
import { SafeAreaView, View } from "react-native";
import {
  Container, Body, Content, Header, Left, Right, Icon,
  Title, Button, Text, Form, Item, Input, Label, Spinner, DatePicker, Picker
} from "native-base";
import styles from '../styles';

class MedicalEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      type: 'Appointment',
      details: '',
      detailsValid: true,
      notes: '',
      notesValid: true,

      inputInProcess: false
    };

    this.renderMedicalForm = this.renderMedicalForm.bind(this);

    this.setDate = this.setDate.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);

    this.onDetailsFocus = this.onDetailsFocus.bind(this);
    this.onDetailsChange = this.onDetailsChange.bind(this);
    this.onDetailsBlur = this.onDetailsBlur.bind(this);
    this.detailsValidity = this.detailsValidity.bind(this);

    this.onNotesFocus = this.onNotesFocus.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.onNotesBlur = this.onNotesBlur.bind(this);
    this.notesValidity = this.notesValidity.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formValidity = this.formValidity.bind(this);

  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Edit Medical</Title>
        </Body>
        <Right />
      </Header>
    )
  });

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Content padder>
            {this.renderMedicalForm()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderMedicalForm() {
    const today = new Date();
    return (
      <Form style={{ flex: 1, alignItems: 'flex-start' }}>

        <Item style={{ flexDirection: 'column', marginBottom: 10, paddingLeft: 0, marginLeft: 0 }}>
          {/* minimumDate={new Date(2010, 1, 1)} */}
          {/* maximumDate={new Date(2028, 12, 31)}*/}
          <DatePicker
            defaultDate={today}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Click here to select the date"
            textStyle={{ color: "#d3d3d3" }}
            placeHolderTextStyle={{ color: "#b3b3b3", fontSize: 16, fontStyle: 'italic' }}
            onDateChange={this.setDate}
            />
            <Text style={{ paddingLeft: 0, marginLeft: 0 }}>
              Date: {this.state.date.toString().substr(4, 12)}
            </Text>
          </Item>

        <Item picker style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label>Type:</Label>
          <View style={{ marginTop: 10 }} />
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            style={{ width: undefined }}
            placeholder="Select medical item type"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.type}
            onValueChange={this.onTypeChange}
          >
            <Picker.Item label="Appointment" value="Appointment" />
            <Picker.Item label="Vaccination" value="Vaccination" />
            <Picker.Item label="Medication" value="Medication" />
            <Picker.Item label="Checkup" value="Checkup" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </Item>

        <Item style={{ paddingLeft: 0, marginLeft: 0 }}>
          <Label>Details:</Label>
          <Input
            style={{ height: 100 }}
            multiline={true}
            keyboardType="default"
            label="Details"
            placeholder="Enter details..."
            value={this.state.details}
            textContentType="none"
            onChangeText={(text) => this.onDetailsChange(text)}
            onBlur={this.onDetailsBlur}
            onFocus={this.onDetailsFocus}
          />
          { !this.state.detailsValid &&
            <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
        </Item>

        <Item last style={{ paddingLeft: 0, marginLeft: 0 }}>
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
    if (!this.state.inputInProcess && this.props.medicalItemInProcess) {
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
    // TODO define medicalItemError
    if (!this.state.inputInProcess && this.props.medicalItemError) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.medicalItemError}
          </Text>
        </View>
      );
    }
  }

  // date function
  setDate(newDate) {
    this.setState({ date: newDate });
  }

  // type function
  onTypeChange(value: string) {
    this.setState({ type: value });
  }

  // details functions

  onDetailsFocus() {
    this.setState( { detailsValid: true,
        inputInProcess: true });
  }

  onDetailsChange(text) {
    this.setState( { details: text, inputInProcess: true });
  }

  onDetailsBlur() {
    this.detailsValidity();
  }

  detailsValidity() {
    const detailsFilter = /^[a-zA-Z0-9\s]*$/;
    const valid = (this.state.details !== '') &&
      detailsFilter.test(this.state.details);

    this.setState({ detailsValid: valid });
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
    const notesFilter = /^[a-zA-Z0-9\s]*$/;
    const valid = (this.state.notes !== '') &&
      notesFilter.test(this.state.notes);


    this.setState(() => ({ notesValid: valid }));
    return valid;
  }

  onClearForm(e) {
		e.preventDefault();
		this.setState({
      date: new Date(),
      type: 'Appointment',
      details: '',
      detailsValid: true,
      notes: '',
      notesValid: true,

      inputInProcess: false
		});
	}

	onSubmitForm() {

    const { date, type, details, notes } = this.state;
		const formPayload = { date, type, details, notes };
    this.setState({ inputInProcess: false });
		if (!this.formValidity()) {
			return false;
		}
    console.log('form values: ', formPayload);
    // this.props.setMedicalItem(formPayload, this.props.navigation);
	}

	formValidity() {
    let errorMsg = "";
    let formValid = true;

    if (!this.detailsValidity()) {
      formValid = false;
      errorMsg = (this.state.details === '') ?
        "Details value cannot be empty" :
        "Unknown error in details";
    }

    if (!this.notesValidity()) {
      formValid = false;
      errorMsg = (errorMsg === "") ?
      "Notes value cannot be empty" :
      errorMsg + "; Notes value cannot be empty";
    }

    this.setState({ errorMsg: errorMsg });
		return formValid;
	}
}

export default MedicalEdit;
