import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import io from "socket.io-client";

let ImagePicker = require('react-native-image-picker');

//Switch Between the real server and the localhost

let host = "https://obscure-beach-68992.herokuapp.com/";
host = "http://10.0.1.9:3000";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      UIControl: "inputName",
      studentName: "Your Name"
    };
    this.socket = io(host);
  }
  takePhoto = () => {
    let options = {
      title: 'Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source
        });
        this.socket.emit("sendMobilePhoto", 'data:image/jpeg;base64,' + this.state.filePath.data, this.state.studentName);
      }
    });
  };
  myNext = function() {
    this.setState({
      UIControl: "snapshot"
    });
  }
  render() {
    const snapshot = 
      <View style={styles.container}>
        {/*<Image 
        source={{ uri: this.state.filePath.path}} 
        style={{width: 100, height: 100}} />*/}
        
        <Button title="Take a photo" onPress={this.takePhoto.bind(this)} />
      </View>;
    const inputName = 
      <View style={styles.container}>
        <View style={{width: 100, height: 100}}>
          <TextInput style={{height: 40, borderColor: "gray", borderWidth: 1}}
                      onChangeText={(studentName) => this.setState({ studentName })}
                      value={this.state.studentName}
          />
        </View>
        <Button title="Next" onPress={this.myNext.bind(this)}></Button>
      </View>
    return (
      <View style={styles.container}>
        {this.state.UIControl == "inputName"? inputName: snapshot}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});