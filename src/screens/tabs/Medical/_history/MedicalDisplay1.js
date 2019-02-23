import React from "react";
import { SafeAreaView, View } from "react-native";
import {
  Container, Body, Content, Header, Card,
  Left, Right, Icon, Title, Button, Text
} from "native-base";

import { getMedicalIcon } from 'mypet/helpers/medicalHelpers';
import styles from '../styles';

class MedicalDisplay extends React.Component {

  static navigationOptions = ({ navigation }) => ({

    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{'Medical Details'}</Title>
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
      <Card style={styles.card}>
        <View style={styles.cardView}>
          <Icon style={styles.icon} name='ios-calendar' />
          <Text style={styles.cardText}>
            {date.toString().substr(4, 12)}
          </Text>
        </View>

        <View style={styles.itemView}>
          <Icon style={styles.icon} name={getMedicalIcon(type)} />
          <Text style={styles.cardText}>{type}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='ios-clipboard' />
          <Text style={styles.textSubTitle}>
            Details:
          </Text>
        </View>
        <Text style={styles.textContent}>{details}</Text>

        <View style={styles.itemView}>
          <Icon style={{ marginRight: 10 }} name='md-text' />
          <Text style={styles.textSubTitle}>
            Notes:
          </Text>
        </View>
        <Text style={styles.textContent}>{notes}</Text>

      </Card>
    );
  }
}

export default MedicalDisplay;
