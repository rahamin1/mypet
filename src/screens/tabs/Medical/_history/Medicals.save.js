import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Alert, FlatList, Modal, TouchableHighlight } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner
} from "native-base";
import { getMedicalIcon } from 'mypet/helpers/medicalHelpers';
import { medicalsFetch, medicalsDelete } from 'mypet/actions';
import styles from '../styles';

class Medical extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      helpModalVisible: false,
      itemsSelection: [] // mark for each medical entry
      // whether it is selected or not
    };

    this.getSelectionIcon = this.getSelectionIcon.bind(this);
    this.setItemSelection = this.setItemSelection.bind(this);
    this.deleteItems = this.deleteItems.bind(this);
    this.edit = this.edit.bind(this);
    this.help = this.help.bind(this);
    this.setHelpModalVisible = this.setHelpModalVisible.bind(this);
  }

  componentDidMount() {
    this.props.medicalsFetch(this.props.auth.email);
  }

  render() {
    // console.log("-----------------------------------");
    // console.log("render list");
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Medical History</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => this.setHelpModalVisible(true)}>
                <Icon name="md-help" />
              </Button>
              <Button
                transparent
                onPress={this.deleteItems}>
                <Icon name="ios-trash" />
              </Button>
              <Button
                transparent
                onPress={() => this.edit(this.props.navigation, null)}>
                <Icon name="md-add" />
              </Button>
            </Right>
          </Header>
          <Content padder style={styles.content}>
            <Card>
              {this.renderMedicalEntries.bind(this)()}
            </Card>
          </Content>
        </Container>
        {this.help()}
      </SafeAreaView>
    );
  }

  renderMedicalEntries() {
    const { medicals, fetchInProgress, addInProgress, updateInProgress } = this.props.medical;

    if (fetchInProgress || addInProgress || updateInProgress) {
      return (
        <View style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
      </View>
      );
    } else if (!medicals || medicals.length === 0) {
      return (
        <CardItem>
          <Left>
          <Text>There are no Medical Items</Text>
          </Left>
        </CardItem>
      );
    } else {
      return (
        <FlatList
          data={medicals}
          extraData={this.state} // make FlatList rerender on state chnage
          renderItem={({ item, index }) => this.renderFlatItem.bind(this)(item, index)}
        />
      );
    }
  }

  renderFlatItem(item, index) {
      //const date = new Date(item.itemDate);
      const date = new Date(item.itemDate).toString().substr(4, 12);
      // Check if item is selected and set its selection icon
      // accordingly
      const selectionIcon = this.getSelectionIcon(index);
      const setItemSelection = this.setItemSelection;
      const navigation = this.props.navigation;
      const edit = this.edit;

      const props = { navigation, selectionIcon, item, index, date, setItemSelection, edit };

      return (
        <MedicalItem {...props} />
      );
  }

  edit(navigation, item) {
    this.setState({ itemsSelection: [] }); // clear selections since list has changed
      // (if we don't clear, items selected may be changed)
    navigation.navigate('MedicalEdit', { item });
  }

  update(navigation, item) {
    this.setState({ itemsSelection: [] }); // clear selections since list has changed
      // (if we don't clear, items selected may be changed)
    navigation.navigate('MedicalUpdate', { item });
  }

  getSelectionIcon(index) {
    return this.state.itemsSelection[index] ?
      // medical entry is selected
      'ios-radio-button-on' :
      // medical entry is not selected
      'ios-radio-button-off';
  }

  setItemSelection(index) {
    const newItemsSelection = [...this.state.itemsSelection];
    newItemsSelection[index] = !this.state.itemsSelection[index];
    this.setState({ itemsSelection: newItemsSelection });
  }

  deleteItems() {
    let deletionList = [];
    const { medicals } = this.props.medical;
    this.state.itemsSelection.map((item, index) => {
      if (item)
        deletionList.push(medicals[index].key);
    });
    if (deletionList.length === 0) {
      this.noItemsToDelete();
    } else {
      this.props.medicalsDelete(this.props.auth.email, deletionList);
      this.setState({ itemsSelection: [] });
    }
  }

  noItemsToDelete() {
    Alert.alert(
      'No items selected to delete',
      '',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: true }
    );
  }

  // Help-Modal code
  setHelpModalVisible(visible) {
    console.log('setHelpModalVisible: ', visible);
    this.setState({ helpModalVisible: visible });
  }

  help() {
    console.log('In help. helpModalVisible: ', this.state.helpModalVisible);
    return (
       <View style={{ marginTop: 22 }}>
         <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.helpModalVisible}
            onRequestClose={() => {
              this.setHelpModalVisible(false);
            }}>
            <View style={{ marginTop: 22 }}>
              <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
              <View>
                <Button block onPress={() => {
                  this.setHelpModalVisible(false);
                }}>
                  <Text>Hide Modal</Text>
                </Button>
              </View>
            </View>
          </Modal>
       </View>
     );
  }
}

// TODO avoid rerendering of all items
// Involves definition of onPress?
// https://facebook.github.io/react-native/docs/flatlist
class MedicalItem extends React.PureComponent {
//class MedicalItem extends React.Component {

  /*
  shouldComponentUpdate(nextProps) {
    const { navigation, selectionIcon, item, index, date, setItemSelection, edit } = this.props;
    console.log(`shouldComponentUpdate <MedicalItem> ${index}`);
    if (nextProps.navigation !== navigation) console.log('--navigation changed');
    if (nextProps.selectionIcon !== selectionIcon) console.log('--selectionIcon changed');
    if (nextProps.item !== item) console.log('--item changed');
    if (nextProps.index !== index) console.log('--index changed');
    if (nextProps.date !== date) console.log('--date changed');
    if (nextProps.setItemSelection !== setItemSelection) console.log('--setItemSelection changed');
    if (nextProps.edit !== edit) console.log('--edit changed');
    console.log(`end comparison props <MedicalItem> ${this.props.index}`);
    return true;
  }
  */

  render() {
    // console.log(`render <MedicalItem> ${this.props.index}`);
    const { navigation, selectionIcon, item, index, date, setItemSelection, edit } = this.props;
    return (
      <CardItem key={item.key}>
        <Left>
          <Icon active name={selectionIcon} style={{ fontSize: 12 }}
             onPress={() => setItemSelection(index)} />
          <Text></Text>
          <Icon active name={getMedicalIcon(item.type)}
            onPress={() =>
            navigation.navigate('MedicalDisplay', { item })} />
          <Text onPress={() =>
            navigation.navigate('MedicalDisplay', { item })}>
            {/*date.toString().substr(4, 12)*/}
            {date}: {item.type}
          </Text>
        </Left>
        <Right>
          <Icon name="ios-paper" onPress={() =>
            edit(navigation, item)} />
        </Right>
      </CardItem>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    medical: state.medical
  };
}

export default connect(mapStateToProps,
  { medicalsFetch, medicalsDelete })(Medical);

// export default connect(mapStateToProps,
//  { fetchBooksList, fetchBooksDetails })(Medical);
