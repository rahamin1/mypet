import React, { Component } from 'react';
import { SafeAreaView, Modal  } from 'react-native';
import {
  Left, Icon, Button,
  Body, Content, Text, Card, CardItem, Thumbnail
} from "native-base";
import { logo } from '../../../constants/miscConstants';
import styles from '../styles';

export default class ContactsHelp extends Component {

  render() {
    const { callback, visible } = this.props;

    return (
       <SafeAreaView style={{ flex: 1, marginTop: 22 }}>
         <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              callback(false);
            }}>
            <Content>
            <Card bordered style={styles.marginAll}>
              <CardItem bordered>
                <Left>
                  <Thumbnail source={logo} />
                  <Body>
                    <Text>My Pet!</Text>
                    <Text note>Contact History: Help</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-medkit" style={styles.icon} />
                <Text style={styles.textMargins}>
                  This is the page displaying the contacts of your pet.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-arrow-round-forward" />
                <Text style={styles.textMargins}>
                  Click on an item to view its details.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon name="md-search" style={styles.icon}/>
                <Text style={styles.textMargins}>
                  Click on this icon in order to search for items.
                  Search is case-sensitive.
                  Clicking on the 'RESET' button will return to the
                  initial display, where all contacts are listed alphabetically.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon name="ios-paper" style={styles.icon}/>
                <Text style={styles.textMargins}>
                  Click on this icon (displayed to the right of an item) in order to modify it.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="ios-radio-button-off"
                  style={[{ fontSize: 14 }, styles.icon]} />
                <Text style={styles.textMargins}>
                  Select one or more items by clicking on this icon (displayed to the left
                  of the item(s)) and then click on the trash icon at the
                  top-right to delete these items.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Button block onPress={() => {
                  callback(false);
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
