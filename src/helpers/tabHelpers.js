import { Alert } from 'react-native';

export const deleteConfirmation = async function(deleteFunc, deletionList) {
  const msg = deletionList.length === 1 ?
    'Are you sure that you want to delete this item?' :
    'Are you sure that you want to delete these items?';

  await Alert.alert(
    msg,
    '',
    [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Yes', onPress: () => {
        deleteFunc(deletionList);
      } }
    ],
    { cancelable: true }
  );
};

export const noItemsToDelete = async() => {
  await Alert.alert(
    'No items selected to delete.',
    '',
    [
      { text: 'OK', onPress: () => {} }
    ],
    { cancelable: true }
  );
};
