import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, FlatList, BackHandler } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner
} from "native-base";
import MedicalItem from './MedicalItem';
import MedicalsHelp from './MedicalsHelp';
import SearchByDate from '../SearchByDate';
import { getMedicalIcon } from '../../../helpers/medicalHelpers';
import { medicalsFetch, medicalsDelete, petFetch } from '../../../actions';
import { renderPetPhoto } from '../../../helpers/renderPetPhoto';
import { deleteConfirmation, noItemsToDelete } from '../../../helpers/tabHelpers';
import styles from '../styles';

class Medicals extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      helpModalVisible: false,
      startDateModalVisible: false,
      itemsSelection: [], // mark for each medical entry
      // whether it is selected or not

      // specify parameters for the medical items displayed
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
    this.setStartDateModalVisible = this.setStartDateModalVisible.bind(this);
    this.setDisplayParameters = this.setDisplayParameters.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    const { userId } = this.props.auth;
    // Parameters of medicalsFetch:
    // 1st - self explanataory
    // 2nd - stratDate for displaed items. null means all items
    // 3rd - display order (true - newestAtTop)
    this.props.medicalsFetch(userId, null, 1);
    this.props.petFetch(userId); // prepare for drawer display
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Contacts');
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
                onPress={() => this.setStartDateModalVisible(true)}>
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

            {this.renderMedicalEntries.bind(this)(dimBackgroundItems)}

            <MedicalsHelp
              visible={helpModalVisible}
              callback={this.setHelpModalVisible}/>
              <SearchByDate
                searchByDate={true}
                visible={startDateModalVisible}
                setStartDateModalVisible={this.setStartDateModalVisible}
                setDisplayParameters={this.setDisplayParameters}
                startDate={this.state.startDate}
                newestAtTop={this.state.newestAtTop}
                itemsToSearch='Medical'
                photo={this.props.pet.photo}/>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderMedicalEntries(dimBackgroundItems) {
    const { medicals, fetchInProgress, addInProgress, updateInProgress } = this.props.medical;

    if (fetchInProgress || addInProgress || updateInProgress) {
      return (
        <Card style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
        </Card>
      );
    } else if (!medicals || medicals.length === 0) {
      return (
        <View>
          <Card>
            {renderPetPhoto(this.props.pet.photo)}
            <CardItem>
              <Left>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  There are no Medical Items, or (if you have searched for items)
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
                  Add a new Medical Item
                </Text>
              </Button>
            </CardItem>
            <CardItem
              style={[{ alignSelf: 'center' }, dimBackgroundItems ? styles.dim : null]}>
              <Button block
                style={dimBackgroundItems ? styles.dim : null}
                onPress={() => this.setStartDateModalVisible(true)}>
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
          <Card>
            <FlatList
              data={medicals}
              extraData={this.state} // make FlatList rerender on state change
              renderItem={({ item, index }) =>
                this.renderFlatItem.bind(this)(item, index, dimBackgroundItems)}
            />
          </Card>
          <Card style={{ alignSelf: 'center' }}>
            <CardItem style={dimBackgroundItems ? styles.dim : null}>
              <Button block
                style={dimBackgroundItems ? styles.dim : null}
                onPress={() => this.setStartDateModalVisible(true)}>
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
        setItemSelection, selectionIcon, selection, edit, getMedicalIcon,
        dimBackgroundItems };

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
      // (if we don't clear, items selected may be changed,
      // since changes may have been done to the displayed list)
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
      noItemsToDelete();
    } else {
      deleteConfirmation(this.delete, deletionList);
    }
  }

  delete(deletionList) {
    this.props.medicalsDelete(this.props.auth.userId, deletionList);
    this.setState({ itemsSelection: [] });
  }

  setHelpModalVisible(visibility) {
    this.setState({ helpModalVisible: visibility });
  }

  setStartDateModalVisible(visibility) {
    this.setState({ startDateModalVisible: visibility });
  }

  setDisplayParameters(startDate, newestAtTop) {
    this.setStartDateModalVisible(false); // The modal should be closed
      // (the user clicked either 'RESET' or 'SUBMIT')
    const { userId } = this.props.auth;

    if (startDate === null) { // means RESET
      this.setState({ // set to initial values
        prevStartDate: new Date(1970, 1, 1),
        startDate: new Date(),
        prevNewestAtTop: 1, // === true
        newestAtTop: 0
      });
      this.props.medicalsFetch(userId, null, 1);
    } else { // values submitted
      if (startDate !== this.state.prevStartDate ||
        newestAtTop !== this.state.prevNewestAtTop) {
          this.setState({ startDate: this.state.prevStartDate,
            newestAtTop: this.state.prevNewestAtTop });
          // need to change display only if there is a change in parameters
          // for explanation of medicalFetch parameters, see in componentDidMount
          this.props.medicalsFetch(userId, startDate, newestAtTop);
        }
    }
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    medical: state.medical,
    pet: state.pet
  };
}

export default connect(mapStateToProps,
  { medicalsFetch, medicalsDelete, petFetch })(Medicals);
