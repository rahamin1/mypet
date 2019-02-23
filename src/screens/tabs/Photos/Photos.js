import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Alert, FlatList, BackHandler } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner
} from 'native-base';
import PhotoItem from './PhotoItem';
import PhotosHelp from './PhotosHelp';
import SearchByDate from '../SearchByDate';
import { photosFetch, photosDelete, petFetch } from '../../../actions';
import { renderPetPhoto } from '../../../helpers/renderPetPhoto';
import { deleteConfirmation, noItemsToDelete } from '../../../helpers/tabHelpers';
import styles from '../styles';

class Photos extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      helpModalVisible: false,
      startDateModalVisible: false,
      itemsSelection: [], // mark for each photo entry
      // whether it is selected or not

      // specify parameters for the photo items displayed
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
    // Parameters of photosFetch:
    // 1st - self explanataory
    // 2nd - stratDate for displaed items. null means all items
    // 3rd - display order (true - newestAtTop)
    this.props.photosFetch(userId, null, 1);
    this.props.petFetch(userId); // prepare for drawer display
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Medicals');
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
              <Title>Photo Gallery</Title>
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

            {this.renderPhotoEntries.bind(this)(dimBackgroundItems)}

            <PhotosHelp
              visible={helpModalVisible}
              callback={this.setHelpModalVisible}/>
            <SearchByDate
              searchByDate={true}
              visible={startDateModalVisible}
              setStartDateModalVisible={this.setStartDateModalVisible}
              setDisplayParameters={this.setDisplayParameters}
              startDate={this.state.startDate}
              newestAtTop={this.state.newestAtTop}
              itemsToSearch='Photo'
              photo={this.props.pet.photo} />
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderPhotoEntries(dimBackgroundItems) {
    const { photos, fetchInProgress, addInProgress, updateInProgress } = this.props.photo;

    if (fetchInProgress || addInProgress || updateInProgress) {
      return (
        <View style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
      </View>
      );
    } else if (!photos || photos.length === 0) {
      return (
        <View>
          <Card>
            {renderPetPhoto(this.props.pet.photo)}
            <CardItem>
              <Left>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
                  There are no Photo Items, or (if you have searched for items)
                  there are no items matching the search parameters.
                </Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                <Text style={dimBackgroundItems ? styles.dimText : null}>
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
                  Add a new Photo Item
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
              data={photos}
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

  // TODO check parameters to following
  renderFlatItem(item, index, dimBackgroundItems) {
      //const date = new Date(item.itemDate);
      const date = new Date(item.itemDate).toString().substr(4, 12);
      // Check if item is selected and set selection status accordingly
      const selection = this.state.itemsSelection[index];
      const selectionIcon = this.getSelectionIcon(index);
      const setItemSelection = this.setItemSelection;
      const navigation = this.props.navigation;
      const edit = this.edit;

      const props = { navigation, item, index, date,
        setItemSelection, selectionIcon, selection, edit,
        dimBackgroundItems };

      return (
        <PhotoItem {...props} />
      );
  }

  edit(navigation, item) {
    this.setState({ itemsSelection: [] });
      // clear selections since list has changed
      // (if we don't clear, items selected may be changed)
    navigation.navigate('PhotoEdit', { item });
  }

  update(navigation, item) {
    this.setState({ itemsSelection: [] }); // clear selections since list has changed
      // (if we don't clear, items selected may be changed,
      // since changes may have been done to the displayed list)
    navigation.navigate('PhotoUpdate', { item });
  }

  getSelectionIcon(index) {
    return this.state.itemsSelection[index] ?
      // photo entry is selected
      'ios-radio-button-on' :
      // photo entry is not selected
      'ios-radio-button-off';
  }

  setItemSelection(index) {
    const newItemsSelection = [...this.state.itemsSelection];
    newItemsSelection[index] = !this.state.itemsSelection[index];
    this.setState({ itemsSelection: newItemsSelection });
  }

  deleteItems() {
    let deletionList = [];
    const { photos } = this.props.photo;
    this.state.itemsSelection.map((item, index) => {
      if (item)
        deletionList.push(photos[index].key);
    });
    if (deletionList.length === 0) {
      noItemsToDelete();
    } else {
      deleteConfirmation(this.delete, deletionList);
    }
  }

  delete(deletionList) {
    this.props.photosDelete(this.props.auth.userId, deletionList);
    this.setState({ itemsSelection: [] });
  }

/*
  deleteItems() {
    let deletionList = [];
    const { photos } = this.props.photo;
    this.state.itemsSelection.map((item, index) => {
      if (item)
        deletionList.push(photos[index].key);
    });
    if (deletionList.length === 0) {
      this.noItemsToDelete();
    } else {
      this.props.photosDelete(this.props.auth.userId, deletionList);
      this.setState({ itemsSelection: [] });
    }
  }

  noItemsToDelete() {
    Alert.alert(
      'No items selected to delete',
      '',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed in Photos/noItemsToDelete') }
      ],
      { cancelable: true }
    );
  }
  */

  // Help-Modal functions
  setHelpModalVisible(visible) {
    this.setState({ helpModalVisible: visible });
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
      this.props.photosFetch(userId, null, 1);
    } else { // values submitted
      if (startDate !== this.state.prevStartDate ||
        newestAtTop !== this.state.prevNewestAtTop) {
          this.setState({ startDate: this.state.prevStartDate,
            newestAtTop: this.state.prevNewestAtTop });
          // need to change display only if there is a change in parameters
          // for explanation of medicalFetch parameters, see in componentDidMount
          this.props.photosFetch(userId, startDate, newestAtTop);
        }
    }
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    photo: state.photo,
    pet: state.pet
  };
}

export default connect(mapStateToProps,
  { photosFetch, photosDelete, petFetch })(Photos);
