import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
 Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox } from "native-base";
 import { ListView, View,Image,Alert,ImageBackground} from 'react-native';
 import { openDatabase } from 'react-native-sqlite-storage';
 var db = openDatabase({name: 'customer.db', createFromLocation: '~Database.db'})
 import RNFetchBlob from 'rn-fetch-blob';
 import localhost from "../components/localhost";


export default class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task_id: '',
      userData: '',
      pic1:'',
      pic2:'',
      pic3:'',
      pic4:'',

    };
    var  task_id  = this.props.navigation.state.params.MyTaskID;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM customer where task_id = ?',
        [task_id],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            this.setState({
              userData: results.rows.item(0),
            });
          } else {
            alert('No user found');
            this.setState({
              userData: '',
            });
          }
        }
      );
    });
  }

  componentWillMount() {
    var pic1 =this.props.navigation.state.params.pic1;
    var pic2 =this.props.navigation.state.params.pic2;
    var pic3 =this.props.navigation.state.params.pic3;
    var pic4 =this.props.navigation.state.params.pic4;
    var  task_id  = this.props.navigation.state.params.MyTaskID;
 
    this.setState({
      pic1:pic1,
      pic2:pic2,
      pic3:pic3,
      pic4:pic4,
      task_id:task_id,

        });
  }


  uploadPic=()=>{
            RNFetchBlob.fetch('POST','http://'+localhost+'/GProject/upload.php', {
              Authorization : "Bearer access-token",
              otherHeader : "foo",
              'Accept': 'application/json',
              'Content-Type' : 'multipart/form-data', 
            }, [
              { name : 'task_id', data :this.state.userData.task_id},
              { name : 'image', filename  : 'image.png', type:'image/png', data:this.state.pic1},
              { name : 'image2', filename : 'image.png', type:'image/png', data:this.state.pic2},
              { name : 'image3', filename : 'image.png', type:'image/png', data:this.state.pic3},
              { name : 'image4', filename : 'image.png', type:'image/png', data:this.state.pic4},
        
            ]).then((response) => response.json())
            .then((responseJson) => {
              Alert.alert(responseJson);
            }).catch((error) => {
              console.error(error);
            }); 
  }



  uploadPhoto(){

    RNFetchBlob.fetch('POST','http://'+localhost+'/GProject/upload.php', {
      Authorization : "Bearer access-token",
      otherHeader : "foo",
      'Content-Type' : 'multipart/form-data', 
    }, [
      { name : 'task_id', data :"task_id"+this.state.userData.task_id},
      { name : 'image', filename : 'image.png',  type:'image/png', data:this.state.pic1},
      { name : 'image2', filename : 'image.png', type:'image/png', data:this.state.pic2},
      { name : 'image3', filename : 'image.png', type:'image/png', data:this.state.pic3},
      { name : 'image4', filename : 'image.png', type:'image/png', data:this.state.pic4},

    ]).then((response) => response.json())
    .then((responseJson) => {
      Alert.alert(responseJson);
      fetch('http://'+localhost+'/GProject/customer.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id : this.state.userData.task_id,
          customer_name : this.state.userData.customer_name,
          customer_contact : this.state.userData.customer_contact,
          customer_address : this.state.userData.customer_address,

        })
  
        }).then((response) => response.json())
            .then((responseJson) => {
  
              // Showing response message coming from server updating records.
              Alert.alert(responseJson);
  
            }).catch((error) => {
              console.error(error);
            });
    }).catch((error) => {
      console.error(error);
    });  
  }


  render() {

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
            <Title>ส่งแบบฟอร์ม</Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content >
  
        <Card>
            <CardItem header bordered>
              <Text>ข้อมูลลูกค้า</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
              <Text>Name: {this.state.userData.customer_name}</Text>
              <Text>Contact: {this.state.userData.customer_contact}</Text>
              <Text>Address: {this.state.userData.customer_address}</Text>
              </Body>
            </CardItem>
            <CardItem footer bordered>
            <Text>หมายเลขงาน {this.state.userData.task_id}</Text>
            </CardItem>
          </Card>

          <List>
         <Card>
          <CardItem header bordered>
          <Text>บัตรประชาชน</Text>
          </CardItem>         
          <CardItem cardBody>
     
        <Image
          source={{uri: 'data:image/jpeg;base64,'+ this.state.pic1}}
          style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
      <Card>
          <CardItem header bordered>
          <Text>สำเนาเบียนบ้าน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
          source={{uri: 'data:image/jpeg;base64,'+ this.state.pic2}}
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
          source={{uri: 'data:image/jpeg;base64,'+ this.state.pic3}}
          style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
      <Card>
          <CardItem header bordered>
          <Text>ใบรับรองเงินเดือน</Text>
          </CardItem>         
          <CardItem cardBody>
        <Image
          source={{uri: 'data:image/jpeg;base64,'+ this.state.pic4}}
          style={{height: 200, width: null, flex: 1}}
        />    
          </CardItem>
      </Card> 
          </List>
   
        </Content>
        <Button full success  onPress={this.uploadPic.bind(this)}>
            <Text>ส่งงาน</Text>
          </Button>

          </ImageBackground>

      </Container>
    );
  }
}
