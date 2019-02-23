import React from "react";
import { SafeAreaView, View, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Card,
  Left, Right, Icon, Title, Button, Text
} from "native-base";

import { getMedicalIcon } from '../../../helpers/medicalHelpers';
import styles from '../styles';

class MedicalDisplay extends React.Component {
  static navigationOptions = {
    header: null
  };

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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() =>
                 this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{'Medical Details'}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            {this.renderMedicalItem.bind(this)()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderMedicalItem() {
    const { itemDate, type, details, notes } = this.props.navigation.state.params.item;
    const date = new Date(itemDate);
    return (
      <Card style={{ flex: 1, padding: 10, alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='ios-calendar' />
          <Text style={{ marginBottom: 20, fontWeight: '500' }}>
            {date.toString().substr(4, 12)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <Icon style={{ marginRight: 10 }} name={getMedicalIcon(type)} />
          <Text style={{ fontWeight: '500' }}>{type}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='ios-clipboard' />
          <Text style={styles.textTitle}>
            Details:{' '}
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>{details}</Text>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='md-text' />
          <Text style={styles.textTitle}>
            Notes:
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>{notes}</Text>
      </Card>
    );
  }
}

export default MedicalDisplay;
