import React from "react";
import { Text } from "react-native";
import {
  Container, Content, Icon, Form, Item, Input, Label, DatePicker, Picker
} from "native-base";

export default class Test extends React.Component {

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#fff' }}>
        <Content padder>
          <Form style={{ flex: 1, alignItems: 'flex-start' }}>

            <Item>
              <DatePicker
                defaultDate={new Date()}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Click here to select date"
                textStyle={{ color: "#d3d3d3" }}
                placeHolderTextStyle={{ color: "#b3b3b3", fontSize: 16, fontStyle: 'italic' }}
                onDateChange={() => console.log('date change')}
                />
              <Text>
                Date: {new Date().toString().substr(4, 12)}
              </Text>
            </Item>

            <Item picker>
              <Label>Type:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                placeholder="Select medical item type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue="value1"
                onValueChange={() => console.log("onValueChange")}
              >
                <Picker.Item label="label1" value="value1" />
                <Picker.Item label="label2" value="value2" />
              </Picker>
            </Item>

            <Item last style={{ padding: 0, margin: 0 }}>
              <Label>Notes:</Label>
              <Input
                block
                style={{ height: 100 }}
                multiline={true}
                keyboardType="default"
                label="Notes"
                placeholder="Enter notes (if any)..."
                value="aaa bbb ccc aaa bbb ccc aaa bbb ccc aaa bbb ccc aaa bbb ccc "
                textContentType="none"
                onChangeText={() => console.log("bla")}
                onBlur={() => console.log("bla")}
                onFocus={() => console.log("bla")}
              />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
