import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput } from 'react-native';
import io from "socket.io-client";

var ImagePicker = require('react-native-image-picker');
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      test: 1,
      text: "Input your name here"
    };
    this.socket = io("http://10.0.2.2:8089");
  }
  chooseFile = () => {
    var options = {
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
        console.log("dsf");
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source
        });
        this.socket.emit("sendMobilePhoto", 'data:image/jpeg;base64,' + this.state.filePath.data);
      }
    });
  };
  myNext = function() {
    this.setState({
      test: this.state.test + 1
    });
    this.socket.emit("sendMobileName", this.state.text);
    console.log(this.socket);
  }
  render() {
    const img = 
      <View style={styles.container}>
        {/*<Image 
        source={{ uri: this.state.filePath.path}} 
        style={{width: 100, height: 100}} />*/}
        
        <Button title="Take a photo" onPress={this.chooseFile.bind(this)} />
      </View>;
    const text = 
      <View style={styles.container}>
        <TextInput style={{height: 40, borderColor: "gray", borderWidth: 1}}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
        />
        <Button title="Next" onPress={this.myNext.bind(this)}></Button>
      </View>
    return (
      <View style={styles.container}>
        {this.state.test == 1? text: img}
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