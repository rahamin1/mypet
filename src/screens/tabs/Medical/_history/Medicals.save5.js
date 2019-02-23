import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Alert, FlatList  } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Spinner
} from "native-base";
import MedicalItem from './MedicalItem';
import MedicalsHelp from './MedicalsHelp';
import MedicalsStartDate from './MedicalsStartDate';
import { getMedicalIcon } from '../../../helpers/medicalHelpers';
import { medicalsFetch, medicalsDelete, petFetch } from '../../../actions';
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
      newestAtTop: true
    };

    this.getSelectionIcon = this.getSelectionIcon.bind(this);
    this.setItemSelection = this.setItemSelection.bind(this);
    this.deleteItems = this.deleteItems.bind(this);
    this.edit = this.edit.bind(this);
    this.setHelpModalVisible = this.setHelpModalVisible.bind(this);
    this.setStartDateModalVisible = this.setStartDateModalVisible.bind(this);
    this.setDisplayParameters = this.setDisplayParameters.bind(this);
  }

  componentDidMount() {
    const { userId } = this.props.auth;
    // Parameters of medicalsFetch:
    // 1st - self explanataory
    // 2nd - stratDate for displaed items. null means all items
    // 3rd - display order (true - newestAtTop)
    this.props.medicalsFetch(userId, null, true);
    this.props.petFetch(userId); // prepare for drawer display
  }

  render() {
    const { helpModalVisible, startDateModalVisible } = this.state;
    const anyModalVisible = helpModalVisible || startDateModalVisible;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container
          style={[styles.container, anyModalVisible ? styles.dim : '']}>
          <Header
            style={[styles.header, anyModalVisible ? styles.dim : '']}>
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
            style={[styles.content, anyModalVisible ? styles.dim : '']}>
            <Card>
              {this.renderMedicalEntries.bind(this)()}
            </Card>
            <MedicalsHelp
              visible={helpModalVisible}
              callback={this.setHelpModalVisible}/>
            <MedicalsStartDate
              visible={startDateModalVisible}
              setStartDateModalVisible={this.setStartDateModalVisible}
              setDisplayParameters={this.setDisplayParameters}
              startDate={this.state.startDate}
              newestAtTop={this.state.newestAtTop} />
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

  setHelpModalVisible(visibility) {
    this.setState({ helpModalVisible: visibility });
  }

  setStartDateModalVisible(visibility) {
    this.setState({ startDateModalVisible: visibility });
  }

  setDisplayParameters(startDate, newestAtTop) {
    console.log('*** in setDisplayParameters');
    console.log('state/prevStartDate: ', this.state.prevStartDate);
    console.log('state/newestAtTop: ', this.state.newestAtTop);
    console.log('*** in setDisplayParameters');
    console.log('startDate: ', startDate);
    console.log('newestAtTop: ', newestAtTop);
    this.setStartDateModalVisible(false); // The modal should be closed
      // (the user clicked either 'RESET' or 'SUBMIT')
    const { userId } = this.props.auth;
    if (startDate !== this.state.prevStartDate ||
      newestAtTop !== this.state.newestAtTop) {
        this.setState({ startDate: this.state.prevStartDate });
        // need to change display only if there is a change in parameters
        // for explanation of medicalFetch parameters, see in componentDidMount
        this.props.medicalsFetch(userId, startDate, newestAtTop);
      }
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
