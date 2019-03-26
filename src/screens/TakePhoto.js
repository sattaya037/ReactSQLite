import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button,
     Body, Content,Text,List,ListItem,Card,CardItem,CheckBox,Picker,Form ,DeckSwiper} from "native-base";
import {  Image,ImageBackground } from 'react-native';
var ImagePicker = require('react-native-image-picker');



export default class TakePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      filePath: {},
      filePath2: {},
      filePath3: {},
      filePath4: {},
      pic1:false,
      pic2:false,
      pic3:false,
      pic4:false,
    };
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
          pic1:true,

        });
      }
    });
  };

  
  chooseFile2 = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath2: source,
          pic2:true,

        });
      }
    });
  };

  chooseFile3 = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath3: source,
          pic3:true,

        });
      }
    });
  };

  chooseFile4 = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath4: source,
          pic4:true,

        });
      }
    });
  };


  send = () => {
  
    this.props.navigation.navigate('MyTaskDetail', {
      pic1: this.state.filePath.data,
      pic2: this.state.filePath2.data,
      pic3: this.state.filePath3.data,
      pic4: this.state.filePath4.data,
      TaskPic:true,
    });

  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
    
  
  render() {
      switch(this.state.selected) {
  
        case 'key1':
        button= <Text>Please Select</Text>

          break;
        
        case 'key2':
         button= <Button iconLeft  style={{justifyContent: 'center'}} onPress={this.chooseFile.bind(this)}>
          <Icon name='md-camera' />
          <Text>บัตรประชาชน</Text>
          </Button>
          break;
  
        case 'key3':
        button= <Button iconLeft  style={{justifyContent: 'center'}}  onPress={this.chooseFile2.bind(this)}>
          <Icon name='md-camera' />
          <Text>สำเนาทะเบียนบ้าน</Text>
          </Button>
           break;
  
        case 'key4':
        button= <Button iconLeft  style={{justifyContent: 'center'}}  onPress={this.chooseFile3.bind(this)}>
        <Icon name='md-camera' />
        <Text>สลิปเงินเดือน</Text>
        </Button>          
        break;

        case 'key5':
        button= <Button iconLeft  style={{justifyContent: 'center'}} onPress={this.chooseFile4.bind(this)}>
        <Icon name='md-camera' />
        <Text>ใบรับรองเงินเดือน</Text>
        </Button>          
        break;
        
        case undefined:
        button= <Text>Please Select</Text>
        break;
          
        default:
          Alert.alert("NUMBER NOT FOUND");
      
        }
  
    
    var check = this.state.pic1
    if(check==true)
    {
      Checkbox1 =
      <ListItem>
      <CheckBox checked={true} />
        <Text>สำเนาบัตรประชาชน</Text>
      </ListItem>
    }else{
      Checkbox1 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>สำเนาบัตรประชาชน</Text>
      </ListItem>
    }
    var check2 = this.state.pic2
    if(check2==true)
    {
      Checkbox2 =
      <ListItem>
      <CheckBox checked={true} />
        <Text>สำเนาทะเบียนบ้าน</Text>
      </ListItem>
    }else{
      Checkbox2 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>สำเนาทะเบียนบ้าน</Text>
      </ListItem>
    }
    var check3 = this.state.pic3

    if(check3==true)
    {
      Checkbox3 =
    <ListItem>
      <CheckBox checked={true} />
        <Text>สลิปเงินเดือน</Text>
      </ListItem>
    }else{
      Checkbox3 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>สลิปเงินเดือน</Text>
      </ListItem>
    }
    var check4 = this.state.pic4
    if(check4==true)
    {
      Checkbox4 =
      <ListItem>
      <CheckBox checked={true} />
        <Text>ใบรับรองเงินเดือน</Text>
      </ListItem>
    }else{
      Checkbox4 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>ใบรับรองเงินเดือน</Text>
      </ListItem>
    }
    return (
        <Container>
         <ImageBackground
              style={{ flex: 1 }}
              source={require('../images/BG.jpg')  
              }
              >
        <Header>
        <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("MyTaskDetail")}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>TakePhoto</Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
         </Header>
         <Content padder>
         
         <Card>
            <Form>
            <Picker
              mode="dropdown"
              placeholder="ถ่ายหลักฐาน"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="ถ่ายหลักฐาน"
              textStyle={{ color: "#5cb85c" }}
              itemStyle={{
                backgroundColor: "#9900ff",
                marginLeft: 10,
                paddingLeft: 20
              }}
              itemTextStyle={{ color: '#788ad2' }}
              style={{ width: undefined }}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item label="ถ่ายหลักฐาน" value="key1" />
              <Picker.Item label="สำเนาบัตรประชาชน" value="key2" />
              <Picker.Item label="สำเนาทะเบียนบ้าน" value="key3" />
              <Picker.Item label="สลิปเงินเดือน" value="key4" />
              <Picker.Item label="ใบรับรองเงินเดือน" value="key5" />

            </Picker>
          </Form>           
            <CardItem>
              <Body>
              {button}
              </Body>
            </CardItem>
         </Card>
         <Card>
         <CardItem >
              <List>
            {Checkbox1}
            {Checkbox2}
            {Checkbox3}
            {Checkbox4}
            </List>
            </CardItem>
         </Card>
       
          
        
          <List>
         <Card>
          <CardItem header bordered>
          <Text>บัตรประชาชน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
          source={{
              uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
              }} style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
      <Card>
          <CardItem header bordered>
          <Text>สำเนาเบียนบ้าน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
          source={{uri: 'data:image/jpeg;base64,' + this.state.filePath2.data,
            }}
          style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
      <Card>
          <CardItem header bordered>
          <Text>สลิปเเงินเดือน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
           source={{uri: 'data:image/jpeg;base64,' + this.state.filePath3.data,
            }}  style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
      <Card>
          <CardItem header bordered>
          <Text>ใบรับรองเงินเดือน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
  source={{uri: 'data:image/jpeg;base64,' + this.state.filePath4.data,
            }} style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
          </List>
        </Content>
        {/* <Button block success  onPress={_ => this.uploadPhoto()} >
            <Text>send </Text>
          </Button> */}
        <Button block success  onPress={_ => this.send()} >
            <Text>Submit </Text>
          </Button>
          </ImageBackground>

      </Container>
    );
  }
}
