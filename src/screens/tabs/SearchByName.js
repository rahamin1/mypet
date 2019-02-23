import React, { Component } from 'react';
import { SafeAreaView, Modal, View  } from 'react-native';
import {
  Body, Content, Text, Card, CardItem, Button, Form, Item, Label, Input
} from "native-base";
import { renderPetPhoto } from '../../helpers/renderPetPhoto';
import styles from './styles';

export default class SearchByName extends Component {

  constructor(props) {
    super(props);

    // For explanation of the state variables, see in componentDidMount
    this.state = {
      searchString: '',
      searchStringValid: true,
      inputInProcess: false
    };

    this.reset = this.reset.bind(this);
    this.onSearchStringFocus = this.onSearchStringFocus.bind(this);
    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.onSearchStringBlur = this.onSearchStringBlur.bind(this);
    this.searchStringValidity = this.searchStringValidity.bind(this);
  }

  componentDidMount() {
    const { searchString } = this.props;
    this.setState({
      searchString
    });
  }

  render() {
    const {
      setSearchModalVisible, setSearchString, visible,
      itemsToSearch, photo
    } = this.props;

    let { searchString } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setSearchModalVisible(false);
          }}>
          <Content>
            <Card style={styles.marginAll}>
              {renderPetPhoto(photo)}
              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={styles.largeTitle}>Search for {itemsToSearch} Items</Text>
              </View>
              <CardItem bordered>
                <Form style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Item style={{
                    marginBottom: 25, paddingLeft: 0,
                    marginLeft: 0, marginTop: 25 }}>
                     <Label style={styles.textTitle}>
                       Search String:
                     </Label>
                     <Input
                       multiline={false}
                       keyboardType="default"
                       label="Search string"
                       placeholder="Enter string..."
                       value={this.state.searchString}
                       textContentType="none"
                       onChangeText={(text) => this.onSearchStringChange(text)}
                       onBlur={this.onSearchStringBlur}
                       onFocus={this.onSearchStringFocus}
                     />
                     { !this.state.searchStringValid &&
                       <Icon name='ios-close-circle' style={{ color: 'red' }}/> }
                   </Item>
                </Form>
              </CardItem>
              <CardItem bordered>
                <Body
                  style={{ flexDirection: 'row',
                  justifyContent: 'space-between',
                   marginLeft: 15, marginRight: 15, marginTop: 20, marginBottom: 20 }}>
                  <Button onPress={() => setSearchModalVisible(false)}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button onPress={() => this.reset()}>
                    <Text>Reset</Text>
                  </Button>
                  <Button onPress={() =>
                    setSearchString(searchString)}>
                    <Text>Submit</Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Modal>
      </SafeAreaView>
    );
  }

  reset() {
    this.setState({
      searchString: '', searchStringValid: true
    });
    this.props.setSearchString(null);
  }

  // searchString functions

  onSearchStringFocus() {
    this.setState( { searchStringValid: true,
        inputInProcess: true });
  }

  onSearchStringChange(text) {
    this.setState( { searchString: text, inputInProcess: true });
  }

  onSearchStringBlur() {
    this.searchStringValidity();
  }

  searchStringValidity() {
    const valid = (this.state.searchString !== '');

    this.setState({ searchStringValid: valid });
    return valid;
  }
}
