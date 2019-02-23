import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Alert, FlatList, Modal  } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner, Thumbnail
} from "native-base";
import MedicalItem from './MedicalItem';
import { getMedicalIcon } from '../../../helpers/medicalHelpers';
import { medicalsFetch, medicalsDelete, petFetch } from '../../../actions';
import { logo } from '../../../constants/miscConstants';
import styles from '../styles';

class Medicals extends React.Component {
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
    const { userId } = this.props.auth;
    this.props.medicalsFetch(userId);
    this.props.petFetch(userId); // prepare for drawer display
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
            <Body style={{ marginRight: 10 }}>
              <Title>Medical History</Title>
            </Body>
            <Right>
              <Button style={styles.minimalPadding}
                transparent
                onPress={() => this.setHelpModalVisible(true)}>
                <Icon name="md-help" />
              </Button>
              <Button style={styles.minimalPadding}
                transparent
                onPress={() => this.props.navigation.navigate('MedicalsStartDate')}>
                <Icon name="md-search" />
              </Button>
              <Button style={styles.minimalPadding}
                transparent
                onPress={this.deleteItems}>
                <Icon name="ios-trash" />
              </Button>
              <Button style={styles.minimalPadding}
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
            {this.help()}
          </Content>
        </Container>
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
      // and selection status accordingly
      const selection = this.state.itemsSelection[index];
      const selectionIcon = this.getSelectionIcon(index);
      const setItemSelection = this.setItemSelection;
      const navigation = this.props.navigation;
      const edit = this.edit;

      const props = { navigation, item, index, date,
        setItemSelection, selectionIcon, selection, edit, getMedicalIcon };

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
      this.props.medicalsDelete(this.props.auth.userId, deletionList);
      this.setState({ itemsSelection: [] });
    }
  }

  noItemsToDelete() {
    Alert.alert(
      'No items selected to delete',
      '',
      [
        { text: 'OK', onPress: () => {} }
      ],
      { cancelable: true }
    );
  }

  // Help-Modal functions
  setHelpModalVisible(visible) {
    this.setState({ helpModalVisible: visible });
  }

  help() {
    return (
       <SafeAreaView style={{ flex: 1, marginTop: 22 }}>
         <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.helpModalVisible}
            onRequestClose={() => {
              this.setHelpModalVisible(false);
            }}>
            <Content>
            <Card style={styles.marginAll}>
              <CardItem bordered>
                <Left>
                  <Thumbnail source={logo} />
                  <Body>
                    <Text>My Pet!</Text>
                    <Text note>Medical History: Help</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-medkit" />
                <Text style={styles.textMargins}>
                  This is the page displaying the medical history of your pet.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="md-arrow-round-forward" />
                <Text style={styles.textMargins}>
                  Click on an item to view its details.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon name="ios-paper-outline" style={{ color: '#aaa' }}/>
                <Text style={styles.textMargins}>
                  Click on this icon (displayed to the right of an item) in order to modify it.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Icon active name="ios-radio-button-off" style={{ fontSize: 12 }} />
                <Text style={styles.textMargins}>
                  Select one or more items by clicking on this icon (displayed to the left
                  of the item(s)) and then click on the trash icon at the top
                  right to delete these items.
                </Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Button block onPress={() => {
                    this.setHelpModalVisible(false);
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
    medical: state.medical
  };
}

export default connect(mapStateToProps,
  { medicalsFetch, medicalsDelete, petFetch })(Medicals);

// export default connect(mapStateToProps,
//  { fetchBooksList, fetchBooksDetails })(Medical);
