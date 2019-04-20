import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
 Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox,Tab,Tabs,TabHeading,
 Textarea,Form,Item,Input,Footer,FooterTab,Badge,Fab   } from "native-base";
import {   Alert ,StyleSheet,RefreshControl,TouchableOpacity ,ListView,View,Image } from 'react-native';
import localhost from "../components/localhost";
import MapView from 'react-native-maps';
import { Col, Row, Grid } from "react-native-easy-grid";
import RNFetchBlob from 'rn-fetch-blob';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({name: 'history.db', createFromLocation: '~Database.db'})/*ประกาศตัวแปร SQLite ให้สามารถเรียกใช้ได้*/
var db2 = openDatabase({name: 'task.db', createFromLocation: '~Database.db'})/*ประกาศตัวแปร SQLite ให้สามารถเรียกใช้ได้*/
var ImagePicker = require('react-native-image-picker');
export default class DoTask extends React.Component {
 state = {
        dataSource: '',
        latitude: null,
        longitude: null,
        startTime: null,
        workTime: null,
        latitude2: null,
        longitude2: null,
        finishTime: null,
        customer_name: null,
        customer_contact: null,
        customer_address: null,
        filePath1: {},
        filePath2: {},
        filePath3: {},
        filePath4: {},
        pic1:false,
        pic2:false,
        pic3:false,
        pic4:false,
        checkbox1:false,
        checkbox2:false,
        marker: null
      };
  
     
  Start=() =>{
    navigator.geolocation.getCurrentPosition( (position)=>{ 
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isMapReady: false,

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
        marker:true,
        startTime:
          date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
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

Working=() =>{
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

    Finish=()=>{
      var that = this;
      var id=this.props.navigation.state.params.MyTaskID;
      var title =this.props.navigation.state.params.MyTaskTitle;
      var detail =this.props.navigation.state.params.MyTaskDetail;
      var email =this.props.navigation.state.params.MyUserEmail;
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      that.setState({
        //Setting the value of the date time
        finishTime:
          date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
      });
      var workTime = this.state.workTime;
      var finishTime =this.state.finishTime;
      if(finishTime !== null){
        fetch('http://'+localhost+'/GProject/finishWork.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id : id,
            finish_time : finishTime,
          })
      
          }).then((response) => response.json())
              .then(() => {
                let partName =  id+"";
                        RNFetchBlob.fetch('POST','http://'+localhost+'/GProject/upload.php', {
                          Authorization : "Bearer access-token",
                          otherHeader : "foo",
                          'Accept': 'application/json',
                          'Content-Type' : 'multipart/form-data', 
                        }, [
                          { name : 'task_id', data :partName},
                          { name : 'customer_name', data :this.state.customer_name},
                          { name : 'customer_contact', data :this.state.customer_contact},
                          { name : 'customer_address', data :this.state.customer_address},
                          { name : 'image', filename  : 'image.png', type:'image/png', data:this.state.filePath1.data},
                          { name : 'image2', filename : 'image.png', type:'image/png', data:this.state.filePath2.data},
                          { name : 'image3', filename : 'image.png', type:'image/png', data:this.state.filePath3.data},
                          { name : 'image4', filename : 'image.png', type:'image/png', data:this.state.filePath4.data},
                    
                        ]).then((response) => response.json())
                        .then((responseJson) => {
                        db.transaction(function(tx) {
                              tx.executeSql(
                                'INSERT INTO history (task_id,task_title,task_detail,user_email,start_time,finish_time) VALUES (?,?,?,?,?,?)',
                                [id,title,detail,email,workTime,finishTime],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    db2.transaction(function(tx) {
                                      tx.executeSql(
                                        'DELETE FROM  task where task_id=?',
                                        [id],
                                        (tx, results) => {
                                          if (results.rowsAffected > 0) {
                                            Alert.alert(
                                              responseJson,
                                              'You are upload successfully',
                                              [
                                                {
                                                  text: 'Ok',
                                
                                                  onPress: () =>
                                                  that.props.navigation.navigate('Home'),
                                                },
                                              ],
                                              { cancelable: false }
                                            );
                                          } else {
                                            alert('upload Failed');
                                          }
                                        }
                                      );
                                    });
                                  } else {
                                    alert('upload Failed');
                                  }
                                }
                              );
                            });
                                     
                        }).catch((error) => {
                          console.log(error);
                        }); 
              }).catch((error) => {
                console.log(error);
              });
      }
     
    }
  

    chooseFile = () => {
      const taskID=this.props.navigation.state.params.MyTaskID;
      let partName = "TaskID" + taskID
       var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          cameraRoll: false,
          path:partName,
      
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
            filePath1: source,  pic1:true
          });
        }
      });
    };
  
    
    chooseFile2 = () => {
      var taskID=this.props.navigation.state.params.MyTaskID;
      let partName = "TaskID" + taskID
       var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          cameraRoll: false,
          path: partName,
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
            filePath2: source, pic2:true
          });
        }
      });
    };
  
    chooseFile3 = () => {
      var taskID=this.props.navigation.state.params.MyTaskID;
      let partName = "TaskID" + taskID
      var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          cameraRoll: false,
          path: partName,
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
            filePath3: source,pic3:true  
          });
        }
      });
    };

    chooseFile4 = () => {
      var taskID=this.props.navigation.state.params.MyTaskID;
      let partName = "TaskID" + taskID
      var options = {
        title: 'Select Image',
        customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
          cameraRoll: false,
          path: partName,
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
            filePath4: source,pic4:true  
          });
        }
      });
    };

    renderMap() {
      let map;
      if(this.state.latitude && this.state.longitude  !== null) {
        map = 
        <View style={styles.container}>
        <MapView
         style={styles.map}            
            initialRegion={{
                latitude:this.state.latitude,
                longitude:this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >

        
            </MapView>
      </View> 
  
      }else{
        map =    
        <View style={styles.container}>
          <Text>onPress</Text>
      </View>   
      }   
        return map;
    }


    renderFormInput = () => (
      <Content>
        <Card>
          <Item regular>
            <Input placeholder='ชื่อ' 
              onChangeText={customer_name => this.setState({ customer_name })}

            />
          </Item>
          <Item regular>
            <Input placeholder='เบอร์โทรศัพท์มือถือ"' 
              onChangeText={customer_contact => this.setState({ customer_contact })}
              maxLength={10}
              keyboardType="numeric"
            />
          </Item>

          <Form>
            <Textarea rowSpan={5} bordered placeholder="ที่อยู่" 
              onChangeText={customer_address => this.setState({ customer_address })}
              maxLength={225}
              numberOfLines={5}
            />
          </Form>
        </Card>
      </Content>
  )


  renderPic() {
    let pic1;
    if(this.state.pic1 == false) {
      pic1 = 
          <Card >
          <CardItem header bordered>
            <Text>บัตรประชาชน</Text>
            </CardItem>         
          <CardItem cardBody>
          <Image source={require('../images/camera.png')} style={{height: 200, width: null, flex: 1}}/>    
          </CardItem>
          </Card> 
    }else{
      pic1 =    
      <Card>
      <CardItem header bordered>
       <Text>บัตรประชาชน</Text>
      </CardItem>         
    <CardItem cardBody>
     <Image source={{uri: 'data:image/jpeg;base64,' + this.state.filePath1.data, }} style={{height: 200, width: null, flex: 1}}/>    
     </CardItem>
    </Card> 
    }   
      return pic1;
  }
  renderPic2() {
    let pic2;
    if(this.state.pic2 == false) {
      pic2 = 
          <Card >
          <CardItem header bordered>
            <Text>สำเนาทะเบียนบ้าน</Text>
            </CardItem>         
          <CardItem cardBody>
          <Image source={require('../images/camera.png')} style={{height: 200, width: null, flex: 1}}/>    
          </CardItem>
          </Card> 
    }else{
      pic2 =    
      <Card>
      <CardItem header bordered>
       <Text>สำเนาทะเบียนบ้าน</Text>
      </CardItem>         
    <CardItem cardBody>
     <Image source={{uri: 'data:image/jpeg;base64,' + this.state.filePath2.data, }} style={{height: 200, width: null, flex: 1}}/>    
     </CardItem>
    </Card> 
    }   
      return pic2;
  }

  renderPic3() {
    let pic3;
    if(this.state.pic3 == false) {
      pic3 = 
          <Card >
          <CardItem header bordered>
            <Text>สลิปเงินเดือน</Text>
            </CardItem>         
          <CardItem cardBody>
          <Image source={require('../images/camera.png')} style={{height: 200, width: null, flex: 1}}/>    
          </CardItem>
          </Card> 
    }else{
      pic3 =    
      <Card>
      <CardItem header bordered>
       <Text>สลิปเงินเดือน</Text>
      </CardItem>         
    <CardItem cardBody>
     <Image source={{uri: 'data:image/jpeg;base64,' + this.state.filePath3.data, }} style={{height: 200, width: null, flex: 1}}/>    
     </CardItem>
    </Card> 
    }   
      return pic3;
  }

  renderPic4() {
    let pic4;
    if(this.state.pic4 == false) {
      pic4 = 
          <Card >
          <CardItem header bordered>
            <Text>ใบรับรองเงินเดือน</Text>
            </CardItem>         
          <CardItem cardBody>
          <Image source={require('../images/camera.png')} style={{height: 200, width: null, flex: 1}}/>    
          </CardItem>
          </Card> 
    }else{
      pic4 =    
      <Card>
      <CardItem header bordered>
       <Text>ใบรับรองเงินเดือน</Text>
      </CardItem>         
    <CardItem cardBody>
     <Image source={{uri: 'data:image/jpeg;base64,' + this.state.filePath4.data, }} style={{height: 200, width: null, flex: 1}}/>    
     </CardItem>
    </Card> 
    }   
      return pic4;
  }

  renderButton1() {
    let button1;
    if(this.state.startTime == null) {
      button1 = 
      <Button small  disabled ><Text> เริ่มทำงาน </Text></Button>

    }else{
      button1 =    
      <Button small  primary  onPress={_ => this.Working(this)}><Text> เริ่มทำงาน </Text></Button>

    }   
      return button1;
  }

  renderButton2() {
    let button2;
  
    if(this.state.workTime == null) {
        button2 =    
        <Button small  disabled  ><Text> เสร็จงาน </Text></Button>

        
   }else{
      button2 =    
        <Button small  success  onPress={_ => this.Finish(this)}><Text> เสร็จงาน </Text></Button>

    }   
      return button2;
  }


  renderCamera = () => (
    <Content >
      <TouchableOpacity  onPress={this.chooseFile.bind(this)}>
         {this.renderPic()}
      </TouchableOpacity>
      <TouchableOpacity  onPress={this.chooseFile2.bind(this)}>
         {this.renderPic2()}
      </TouchableOpacity>
      <TouchableOpacity  onPress={this.chooseFile3.bind(this)}>
         {this.renderPic3()}
      </TouchableOpacity>
      <TouchableOpacity  onPress={this.chooseFile4.bind(this)}>
         {this.renderPic4()}
      </TouchableOpacity>
  </Content>
  )

  renderCheckbox() {
    let Check1;
    if(this.state.customer_name&&this.state.customer_contact&&this.state.customer_address !== null) {
          Check1 = 
          <CheckBox checked={true} color="green"/>
    }else{
      Check1 =    
      <CheckBox checked={false}/>
    }   
      return Check1;
  }

  renderCheckbox2() {
    let Check2;
    if(this.state.pic1&&this.state.pic2&&this.state.pic3&&this.state.pic4 !== false) {
     
          Check2 = 
           <CheckBox checked={true} color="green"/> 
    }else{
      Check2 =  
      <CheckBox checked={false} />
    }   
      return Check2;
  }
 

  render() {
    return (
        <Container>
        <HeaderImageScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require("../images/headercolor.jpg")}
      renderForeground={() => (
        <View style={{ height: 150}} >
                <List>
                    <ListItem avatar>
                        <Left> 
                        </Left>
                        <Body>
                        <Text style={{color: '#ffff', fontSize:20 }}>หัวข้องาน:{this.props.navigation.state.params.MyTaskTitle} </Text>
                        <Text style={{color: '#f2f2f2', fontSize:15 }}>รายละเอียดงาน:{this.props.navigation.state.params.MyTaskDetail} </Text>
                        </Body>
                        <Right>
                        </Right>
                      </ListItem>
                </List>
                <Grid>
                  <Col style={{height: 50}}>
                  <ListItem>
                  {this.renderCheckbox()}
                    <Body>
                  <Text style={{color: '#ffff'}}>เก็บข้อมูล</Text>
                    </Body>
                  </ListItem>
                  </Col>
                  <Col style={{height: 50}}>
                  <ListItem>
                  {this.renderCheckbox2()}
                    <Body>
                  <Text style={{color: '#ffff'}}>ถ่ายหลักฐาน</Text>
                    </Body>
                  </ListItem>
                  </Col>
                </Grid>
          </View>
      )}
        >
        <Tabs>
          <Tab heading={ <TabHeading><Icon  /><Text>สถานที่</Text></TabHeading>}>
          {this.renderMap()}
          </Tab>
          <Tab heading={ <TabHeading><Text>กรอกเอกสาร</Text></TabHeading>}>
          {this.renderFormInput()}
          </Tab>
          <Tab heading={ <TabHeading><Icon  /><Text>ถ่ายหลักฐาน</Text></TabHeading>}>
          {this.renderCamera()}
          </Tab>

        </Tabs>
        </HeaderImageScrollView> 

        <CardItem footer bordered>   
              <Left>
              <Button small  info onPress={_ => this.Start()}><Text> เริ่มเดินทาง </Text></Button>

              </Left>
              <Body>
              {this.renderButton1()}
              </Body>
              <Right>
              {this.renderButton2()}
              </Right>
        </CardItem>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  container: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
  marker: {
    marginLeft: 46,
    marginTop: 33,
    fontWeight: 'bold',
  },
});