import React, { Component } from 'react';
import { SafeAreaView, Modal, View  } from 'react-native';
import {
  Body, Content, Text, Card, CardItem, Button, Form, Item, DatePicker
} from "native-base";
import RadioForm from 'react-native-simple-radio-button';
import styles from '../styles';

const radioValues = [
  { label: 'Newest at top   ', value: 0 },
  { label: 'Oldest at top', value: 1 }
];

export default class MedicalsStartDate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      newestAtTop: true
    };

    this.setDate = this.setDate.bind(this);
    this.setDisplayOrder = this.setDisplayOrder.bind(this);
  }

  componentDidMount() {
    const { startDate, newestAtTop } = this.props;
    const newFirst = newestAtTop ? 0 : 1;
    this.setState({ startDate, newestAtTop: newFirst });
  }

  render() {
    const {
      setStartDateModalVisible, setDisplayParameters, visible
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
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={styles.largeTitle}>Set start date and display order</Text>
                <Text style={styles.largeTitle}> for medical items</Text>
              </View>
              <CardItem bordered>
                <Form style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Item style={{ flexDirection: 'column', marginBottom: 10,
                     paddingLeft: 0, marginLeft: 0, marginTop: 10 }}>
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
                        Medical items start date: {this.state.startDate.toString().substr(4, 12)}
                      </Text>
                    </Item>
                  {/* this.renderButtonOrSpinner() */}

                  <Text style={{ marginTop: 10, marginBottom: 5 }}>
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
                   marginLeft: 15, marginRight: 15 }}>
                  <Button onPress={() => setStartDateModalVisible(false)}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button onPress={() =>
                    setDisplayParameters(null, newestAtTop)}>
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
    const newestAtTop = (value === 0);  // 0 means newestAtTop
    this.setState({ newestAtTop });
  }
}
