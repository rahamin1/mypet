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
    flex: 1,
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#ad41ad'
  },
  button: {
    marginBottom: 10
  },
  errorTextStyle: {
    color: 'red'
  }
});

export default styles;
