import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Linking, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Left, Right,
  Icon, Card, CardItem, Title, Button, Text
} from "native-base";
import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { renderPhoto } from './Help';
import styles from './styles';

class About extends React.Component {

  state = { version: 1.0 }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.setState({ version: Constants.manifest.version });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Main');
    return true;
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
              <Title>About</Title>
            </Body>
            <Right />
          </Header>
          <Content padder style={styles.content}>
            {this.about.bind(this)()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  about() {
    return (
      <Card style={styles.marginAll}>
        <CardItem bordered>
          <Left>
            { renderPhoto(this.props.pet) }
            <Body>
              <Text style={styles.textTitle}>
                My Pet!
            </Text>
              <Text style={styles.textSubTitle}>Some information</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-information-circle" />
          <Text style={styles.textPadding}>
            This is version{' '}
            <Text style={{ fontWeight: '400' }}>
              {this.state.version}
            </Text>
            {' '}of the application (still in beta).
          </Text>
        </CardItem>

        <CardItem bordered>
          <Icon active name="md-contact" />
          <Text style={styles.textPadding}
            onPress={() => Linking.openURL('https://www.upwork.com/freelancers/~01c55c0e7cd70bece4')}>
            MyPet! has been developed by{' '}
            <Text style={styles.blueTextStyle}>Yossi Glass</Text>.
          </Text>
        </CardItem>

        <CardItem bordered>
          <Icon active name="md-images" />
          <Text style={styles.textPadding}
            onPress={() => Linking.openURL('https://www.canva.com')}>
            The app's splash screen and logo were designed at{' '}
             <Text style={styles.lightBlueTextStyle}
               onPress={() => Linking.openURL('https://www.canva.com')}>
                 www.canva.com.
             </Text>
          </Text>
        </CardItem>

        <CardItem bordered>
          <MaterialIcons active name="copyright"
            style={{ fontSize: 22, marginRight: 10 }}/>
          <Text style={styles.textPadding}>
            Copyright 2018 Yossi Glass.
          </Text>
        </CardItem>

        <CardItem bordered>
          <Left />
          <Text style={[styles.textPadding,
            { alignSelf: 'center', color: '#cb42f4' }]}>
            We hope that you enjoy
            <Text style={{ fontWeight: '500', color: '#cb42f4' }}>
              {' '}MyPet!
            </Text>
          </Text>
          <Right />
        </CardItem>
        <CardItem bordered>
          <Body>
            <Button block onPress={() => {
              this.props.navigation.navigate('Main');
            }}>
              <Text>Close</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
     );
  }
}

function mapStateToProps(state) {
  return {
    pet: state.pet
  };
}

export default connect(mapStateToProps)(About);
