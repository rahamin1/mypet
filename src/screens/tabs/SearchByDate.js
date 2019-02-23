import React, { Component } from 'react';
import { SafeAreaView, Modal, View  } from 'react-native';
import {
  Body, Content, Text, Card, CardItem, Button, Form, Item, DatePicker
} from "native-base";
import RadioForm from 'react-native-simple-radio-button';
import { renderPetPhoto } from '../../helpers/renderPetPhoto';
import styles from './styles';

const radioValues = [
  { label: 'Order by date   ', value: 0 },
  { label: 'Reverse order', value: 1 }
];

// Search by date for medicals, photos, foods
// Search for contacts is done alphabetically in a differnt component
export default class SearchByDate extends Component {

  constructor(props) {
    super(props);

    // For explanation of the state variables, see in componentDidMount
    this.state = {
      startDate: new Date(),
      newestAtTop: 0,
      searchString: ''
    };

    this.setDate = this.setDate.bind(this);
    this.setDisplayOrder = this.setDisplayOrder.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const { startDate, newestAtTop, searchString } = this.props;
    this.setState({
      startDate, newestAtTop, searchString
    });
  }

  render() {
    const {
      setStartDateModalVisible, setDisplayParameters, visible,
      itemsToSearch, photo
    } = this.props;

    let { startDate, newestAtTop } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setStartDateModalVisible(false);
          }}>
          <Content>
            <Card style={styles.marginAll}>
              {renderPetPhoto(photo)}
              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={styles.largeTitle}>Search for {itemsToSearch} Items</Text>
                <Text style={styles.textTitle}>Set start date and display order</Text>
              </View>
              <CardItem bordered>
                <Form style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Item style={{ flexDirection: 'column', marginBottom: 25,
                     paddingLeft: 0, marginLeft: 0, marginTop: 25 }}>
                    <DatePicker
                      defaultDate={this.state.startDate}
                      locale={"en"}
                      timeZoneOffsetInMinutes={0}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"default"}
                      placeHolderText="Click here to change the start date"
                      textStyle={{ color: "#d3d3d3" }}
                      placeHolderTextStyle={{ color: "#b3b3b3", fontSize: 16, fontStyle: 'italic' }}
                      onDateChange={this.setDate}
                      />
                      <Text style={{ paddingLeft: 0, marginLeft: 0 }}>
                        {itemsToSearch} items start date:{' '}
                        {this.state.startDate.toString().substr(4, 12)}
                      </Text>
                    </Item>
                  {/* this.renderButtonOrSpinner() */}

                  <Text style={{ marginTop: 20, marginBottom: 20 }}>
                    Order of display:
                  </Text>
                  <RadioForm
                    radio_props={ radioValues }
                    initial={this.state.newestAtTop}
                    isSelected={true}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#000'}
                    animation={true}
                    borderWidth={1}
                    selectedButtonColor={'#444'}
                    buttonSize={15}
                    buttonOuterSize={20}
                    buttonStyle={{}}
                    buttonWrapStyle={{ marginRight: 5 }}
                    onPress={(value) => {
                      this.setDisplayOrder(value);
                    }}
                  />
                </Form>

              </CardItem>
              <CardItem bordered>
                <Body
                  style={{ flexDirection: 'row', justifyContent: 'space-between',
                   marginLeft: 15, marginRight: 15, marginTop: 20, marginBottom: 20 }}>
                  <Button onPress={() => setStartDateModalVisible(false)}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button onPress={() => this.reset()}>
                    <Text>Reset</Text>
                  </Button>
                  <Button onPress={() =>
                    setDisplayParameters(startDate, newestAtTop)}>
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

  setDate(newDate) {
    this.setState({ startDate: newDate });
  }

  setDisplayOrder(value) {
    this.setState({ newestAtTop: value });
  }

  reset() {
    this.setState({
      startDate: new Date(),
      newestAtTop: 0
    });
    this.props.setDisplayParameters(null, 1);
  }
}
