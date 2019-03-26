import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
 Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox } from "native-base";
import {   Alert ,ImageBackground,RefreshControl,ActivityIndicator,ListView,View,Image } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db2 = openDatabase({ name: 'TaskDatabase.db' });
import localhost from "../components/localhost";

export default class MyTaskDetail extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });
      this.state = {
        dataSource: ds.cloneWithRows([]),
        latitude: '',
        longitude: '',
        startTime: '',
        unlock:false,
        workTime: '',
        unlock2:false,
        latitude2: '',
        longitude2: '',

      };
      db2.transaction(tx => {
        tx.executeSql('SELECT * FROM my_task', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            dataSource: ds.cloneWithRows(temp),
          });
        });
      });
  }
     
  getStart=() =>{
    navigator.geolocation.getCurrentPosition( (position)=>{ 
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
          error: null,
        });    
      var that = this;
      var id  =this.props.navigation.state.params.MyTaskID ;
      var latitude =this.state.latitude;
      var longitude =this.state.longitude;
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      that.setState({
        //Setting the value of the date time
        startTime:
          date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        unlock: true,
      });
      var startTime =this.state.startTime;

  fetch('http://'+localhost+'/GProject/trackingTask.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id : id,
      start_lat : latitude,
      start_long : longitude,
      start_time : startTime,
    })

    }).then((response) => response.json())
        .then((responseJson) => {
          Alert.alert(responseJson);
        }).catch((error) => {
          console.error(error);
        });  
  },
  (error) => this.setState({ error: error.message }),
  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );  
};

getArrived=() =>{
      navigator.geolocation.getCurrentPosition( (position)=>{ 
        this.setState({
          latitude2: position.coords.latitude,
          longitude2: position.coords.longitude,
            error: null,
          });    
        var that = this;
        var id  =this.props.navigation.state.params.MyTaskID ;
        var latitude2 =this.state.latitude2;
        var longitude2 =this.state.longitude;
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        
        that.setState({
          //Setting the value of the date time
          workTime:
            date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
          unlock2: true,
        });
        var workTime =this.state.workTime;
  
    fetch('http://'+localhost+'/GProject/startWork.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : id,
        work_lat : latitude2,
        work_long : longitude2,
        work_time : workTime,
      })
  
      }).then((response) => response.json())
          .then((responseJson) => {
            Alert.alert(responseJson);
          }).catch((error) => {
            console.error(error);
          });  
    },
    (error) => this.setState({ error: error.message }),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    };

    customerInfo = () => {
  
      this.props.navigation.navigate('CustomerInfo', {
        MyTaskID: this.props.navigation.state.params.MyTaskID,
       
      });
  
    }

    sendInfo = () => {
      this.props.navigation.navigate('Send', {
        MyTaskID: this.props.navigation.state.params.MyTaskID,
        pic1 :this.props.navigation.state.params.pic1,
        pic2 :this.props.navigation.state.params.pic2,
        pic3 :this.props.navigation.state.params.pic3,
        pic4 :this.props.navigation.state.params.pic4,

      });
    }



  render() {

    var checkPic =this.props.navigation.state.params.TaskPic;
    if(checkPic==true){
      Checkbox1 =
      <ListItem>
      <CheckBox checked={true} />
        <Text>ถ่ายหลักฐาน</Text>
      </ListItem>
    }else{
      Checkbox1 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>ถ่ายหลักฐาน</Text>
      </ListItem>}


    var checkInfo =this.props.navigation.state.params.TaskInfo;
    if(checkInfo==true){
      Checkbox2 =
      <ListItem>
      <CheckBox checked={true} />
        <Text>กรอกเอกสาร</Text>
      </ListItem>
    }else{
      Checkbox2 =
      <ListItem>
      <CheckBox checked={false} />
        <Text>กรอกเอกสาร</Text>
      </ListItem>}
      
  
    return (
        <Container>
        <ImageBackground
              style={{ flex: 1 }}
              source={require('../images/BG.jpg')  
              }
              >
        <Header>
        <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>MyTaskDetail </Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>       
         <Content padder>
         
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Body>
              <Text>Title:{this.props.navigation.state.params.MyTaskTitle}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri:''}} style={{height: 200, width: 200, flex: 1}}/>
                <Text>
                Detail:
                {this.props.navigation.state.params.MyTaskDetail}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
              <List>
              <ListItem >
              <Button rounded info onPress={_ => this.getStart()} style={{width: 110, height: 40}}>
                  <Text>เริ่มทำงาน</Text>
                </Button>
                </ListItem>    
                <ListItem >     
                {this.state.unlock ? (
                  <Button rounded success onPress={_ => this.getArrived()} style={{width: 110, height: 40}}>
                  <Text>ถึงที่ทำงาน</Text>
                </Button>
                  ) : null}
                  </ListItem> 
                  {Checkbox1}
                  {Checkbox2}   
                  </List>
               
              </Left>
              <Right>

                {this.state.unlock2 ? (
                  <Card >
                  <CardItem>
                  <Button rounded light onPress={() => this.props.navigation.navigate("TakePhoto")} style={{width: 110, height: 40}}>
                  <Text>ถ่ายหลักฐาน</Text>
                </Button>
                  </CardItem>
                  <CardItem>
                  <Button rounded light onPress={_ => this.customerInfo()} style={{width: 110, height: 40}}>
                  <Text>กรอกเอกสาร</Text>
                </Button>
                  </CardItem>
                  <CardItem>
                  <Button rounded light style={{width: 110, height: 40}}>
                  <Text>Report</Text>
                </Button>
                  </CardItem>
                  <CardItem>
                  <Button rounded light  onPress={_ => this.sendInfo()} style={{width: 110, height: 40}}>
                  <Text>ส่งงาน</Text>
                </Button>
                  </CardItem>
               </Card>
                  ) : null}
            </Right>
            </CardItem>
          </Card>
         </Content>
         </ImageBackground>
      </Container>
    );
  }
}
