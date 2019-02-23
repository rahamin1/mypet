import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, FlatList, BackHandler } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner
} from "native-base";
import ContactItem from './ContactItem';
import ContactsHelp from './ContactsHelp';
import SearchByName from '../SearchByName';
import { contactsFetch, contactsDelete, petFetch } from '../../../actions';
import { renderPetPhoto } from '../../../helpers/renderPetPhoto';
import { deleteConfirmation, noItemsToDelete } from '../../../helpers/tabHelpers';
import styles from '../styles';

class Contacts extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      helpModalVisible: false,
      startDateModalVisible: false,
      itemsSelection: [], // mark for each contact entry
      // whether it is selected or not

      // specify parameters for the contact items displayed
      searchString: '',

      // TODO - The following are not relevant for this search
      // (they are relevant for photos, medicals)
      prevStartDate: new Date(1970, 1, 1),
      startDate: new Date(),
      prevNewestAtTop: 1, // === true
      newestAtTop: 0  // === false: usually, a user that
        // is searching from a date, would like to see normal date order
    };

    this.getSelectionIcon = this.getSelectionIcon.bind(this);
    this.setItemSelection = this.setItemSelection.bind(this);
    this.deleteItems = this.deleteItems.bind(this);
    this.edit = this.edit.bind(this);
    this.setHelpModalVisible = this.setHelpModalVisible.bind(this);
    this.setSearchModalVisible = this.setSearchModalVisible.bind(this);
    this.setSearchString = this.setSearchString.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    const { userId } = this.props.auth;
    // Parameters of contactsFetch:
    // 1st - self explanataory
    // 2nd - stratDate for displaed items. null means all items
    // 3rd - display order (true - newestAtTop)
    this.props.contactsFetch(userId, null, 1);
    this.props.petFetch(userId); // prepare for drawer display
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Food');
    return true;
  }

  render() {
    const { helpModalVisible, startDateModalVisible } = this.state;
    const dimBackgroundItems = helpModalVisible || startDateModalVisible;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container
          style={[styles.container, dimBackgroundItems ? styles.dim : null]}>
          <Header
            style={[styles.header, dimBackgroundItems ? styles.dim : null]}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body style={{ marginRight: 10 }}>
              <Title>Contacts</Title>
            </Body>
            <Right>
              <Button style={styles.minimalPadding}
                transparent
                onPress={() => this.setHelpModalVisible(true)}>
                <Icon name="md-help" />
              </Button>
              <Button style={styles.minimalPadding}
                transparent
                onPress={() => this.setSearchModalVisible(true)}>
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
          <Content padder
            style={[styles.content, dimBackgroundItems ? styles.dim : null]}>

            {this.renderContactEntries.bind(this)(dimBackgroundItems)}

            <ContactsHelp
              visible={helpModalVisible}
              callback={this.setHelpModalVisible}/>
            <SearchByName
              searchByDate={false}
              visible={startDateModalVisible}
              setSearchModalVisible={this.setSearchModalVisible}
              setSearchString={this.setSearchString}
              startDate={this.state.startDate}
              newestAtTop={null}
              itemsToSearch='Contact'
              searchString={this.state.searchString}
              photo={this.props.pet.photo}/>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderContactEntries(dimBackgroundItems) {
    const { contacts, fetchInProgress, addInProgress, updateInProgress } = this.props.contact;

    if (fetchInProgress || addInProgress || updateInProgress) {
      return (
        <Card style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
        </Card>
      );
    } else if (!contacts || contacts.length === 0) {
      return (
        <View>
          <Card>
            {renderPetPhoto(this.props.pet.photo)}
            <CardItem>
              <Left>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  There are no Contact Items, or (if you have searched for items)
                  there are no items matching the search parameters.
                </Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                <Text>
                  In such a case, try another search, or do a 'RESET' within search.
                </Text>
              </Left>
            </CardItem>
            <CardItem
              style={[{ alignSelf: 'center' }, dimBackgroundItems ? styles.dim : null]}>
              <Button block
                style={dimBackgroundItems ? styles.dim : null}
                onPress={() => this.edit(this.props.navigation, null)}>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  Add a new Contact Item
                </Text>
              </Button>
            </CardItem>
            <CardItem
              style={[{ alignSelf: 'center' }, dimBackgroundItems ? styles.dim : null]}>
              <Button block
                style={dimBackgroundItems ? styles.dim : null}
                onPress={() => this.setSearchModalVisible(true)}>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  Search for items
                </Text>
              </Button>
            </CardItem>
          </Card>
        </View>
      );
    } else {
      return (
        <View>
          <Card style={{ padding: 1 }}>
            <FlatList
              data={contacts}
              extraData={this.state} // make FlatList rerender on state change
              renderItem={({ item, index }) =>
                this.renderFlatItem.bind(this)(item, index, dimBackgroundItems)}
            />
          </Card>
          <Card style={{ alignSelf: 'center' }}>
            <CardItem style={dimBackgroundItems ? styles.dim : null}>
              <Button block
                style={dimBackgroundItems ? styles.dim : null}
                onPress={() => this.setSearchModalVisible(true)}>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  Search for additional items
                </Text>
              </Button>
            </CardItem>
          </Card>
        </View>
      );
    }
  }

  renderFlatItem(item, index, dimBackgroundItems) {
      // Check if item is selected and set its selection icon
      // and selection status accordingly
      const selection = this.state.itemsSelection[index];
      const selectionIcon = this.getSelectionIcon(index);
      const setItemSelection = this.setItemSelection;
      const navigation = this.props.navigation;
      const edit = this.edit;

      const props = { navigation, item, index,
        setItemSelection, selectionIcon, selection, edit,
        dimBackgroundItems };

      return (
        <ContactItem {...props} />
      );
  }

  edit(navigation, item) {
    this.setState({ itemsSelection: [] }); // clear selections since list has changed
      // (if we don't clear, items selected may be changed)
    navigation.navigate('ContactEdit', { item });
  }

  update(navigation, item) {
    this.setState({ itemsSelection: [] }); // clear selections since list has changed
      // (if we don't clear, items selected may be changed,
      // since changes may have been done to the displayed list)
    navigation.navigate('ContactUpdate', { item });
  }

  getSelectionIcon(index) {
    return this.state.itemsSelection[index] ?
      // contact entry is selected
      'ios-radio-button-on' :
      // contact entry is not selected
      'ios-radio-button-off';
  }

  setItemSelection(index) {
    const newItemsSelection = [...this.state.itemsSelection];
    newItemsSelection[index] = !this.state.itemsSelection[index];
    this.setState({ itemsSelection: newItemsSelection });
  }

  deleteItems() {
    let deletionList = [];
    const { contacts } = this.props.contact;
    this.state.itemsSelection.map((item, index) => {
      if (item)
        deletionList.push(contacts[index].key);
    });
    if (deletionList.length === 0) {
      noItemsToDelete();
    } else {
      deleteConfirmation(this.delete, deletionList);
    }
  }

  delete(deletionList) {
    this.props.contactsDelete(this.props.auth.userId, deletionList);
    this.setState({ itemsSelection: [] });
  }

  setHelpModalVisible(visibility) {
    this.setState({ helpModalVisible: visibility });
  }

  setSearchModalVisible(visibility) {
    this.setState({ startDateModalVisible: visibility });
  }

  setSearchString(searchString) {
    this.setSearchModalVisible(false); // The modal should be closed
      // (the user clicked either 'RESET' or 'SUBMIT')
    const { userId } = this.props.auth;

    if (searchString === null) { // means RESET
      this.setState({ // set to initial values
        prevStartDate: new Date(1970, 1, 1),
        startDate: new Date(),
        prevNewestAtTop: 1, // === true
        newestAtTop: 0
      });
      this.props.contactsFetch(userId, null, 1);
    } else { // search string submitted
      this.props.contactsFetch(userId, searchString);
    }
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    contact: state.contact,
    pet: state.pet
  };
}

export default connect(mapStateToProps,
  { contactsFetch, contactsDelete, petFetch })(Contacts);
