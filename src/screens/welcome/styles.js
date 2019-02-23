import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  },
  content: {
    flex: 1
  },
  header: {
    backgroundColor: '#41b8f4'
  },
  button: {
    margin: 10
  }
});

export default styles;
