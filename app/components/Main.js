import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, AppState, AsyncStorage } from 'react-native';
import Note from './Note';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteArray: [],
      noteText: '',
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    console.log(nextAppState);
    if (nextAppState === 'active') {
      console.log('active');
      this.getNotes();
    }
    else {
      console.log('not active');
      this.saveNotes();
    }
    this.setState({appState: nextAppState});
  }

  async getNotes() {
    console.log("get notes");
    try {
      const noteArray = await AsyncStorage.getItem('notes');
      if (noteArray !== null){
        this.setState({
          noteArray: JSON.parse(noteArray)
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveNotes() {
    console.log("save notes");
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(this.state.noteArray));
    } catch (error) {
      console.log(error);
    }
  }

  addNote() {
    console.log("adding", this.state.noteText);
    if(this.state.noteText) {
      let date = new Date();
      this.state.noteArray.push({
        date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        note: this.state.noteText
      });

      this.setState({
        noteArray: this.state.noteArray,
        noteText: ''
      });
    }
  }

  deleteMethod(key) {
    this.state.noteArray.splice(key, 1);
    this.setState({
      noteArray: this.state.noteArray
    });
  }

  render() {

    let notes = this.state.noteArray.map((val, key) => {
      return <Note key={key} keyval={key} val={val} deleteMethod={this.deleteMethod.bind(this, key)} />
    });

    return (
      <View style={styles.container}>
          <View style={styles.header}>
              <Text style={styles.headerText}>-- NOTER --</Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
              {notes}
          </ScrollView>
          <View style={styles.footer}>
              <TextInput 
                  style={styles.textInput}
                  placeholder='>note'
                  onChangeText={(noteText)=> this.setState({noteText})}
                  value={this.state.noteText}
                  placeholderTextColor='white'
                  underlineColorAndroid='transparent'>
              </TextInput>
          </View>
          <TouchableOpacity onPress={ this.addNote.bind(this) } style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
      </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent:'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd'
  },
  headerText: {
      color: 'white',
      fontSize: 18,
      padding: 26
  },
  scrollContainer: {
      flex: 1,
      marginBottom: 100
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
  },
  textInput: {
      alignSelf: 'stretch',
      color: '#fff',
      padding: 20,
      backgroundColor: '#252525',
      borderTopWidth:2,
      borderTopColor: '#ededed'
  },
  addButton: {
      position: 'absolute',
      zIndex: 11,
      right: 20,
      bottom: 90,
      backgroundColor: '#E91E63',
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8
  },
  addButtonText: {
      color: '#fff',
      fontSize: 24
  }
});