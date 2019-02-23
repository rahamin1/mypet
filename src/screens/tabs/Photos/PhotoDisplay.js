import React from "react";
import { SafeAreaView, View, Image, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Card, CardItem,
  Left, Right, Icon, Title, Button, Text
} from "native-base";
import { photoHeight } from '../../../constants/miscConstants';
import styles from '../styles';

class PhotoDisplay extends React.Component {
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
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{'Photo Details'}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            {this.renderPhotoItem.bind(this)()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderPhotoItem() {
    const { itemDate, title, notes, photo } = this.props.navigation.state.params.item;
    const date = new Date(itemDate);
    return (
      <Card style={{ flex: 1, padding: 10, alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='ios-calendar' />
          <Text style={{ marginBottom: 20, fontWeight: '500' }}>
            {date.toString().substr(4, 12)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginRight: 70 }}>
          <Icon style={{ marginRight: 10 }} name='ios-clipboard' />
          <Text style={styles.textTitle}>
            Title:{' '}
          </Text>
          <Text style={{ marginBottom: 20 }}>{title}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='md-text' />
          <Text style={styles.textTitle}>
            Notes:
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>{notes}</Text>

        <CardItem cardBody>
          <Image source={{ uri: photo }}
          style={{ height: photoHeight, width: null,
          resizeMode: 'contain', flex: 1 }}/>
        </CardItem>

      </Card>
    );
  }
}

export default PhotoDisplay;
