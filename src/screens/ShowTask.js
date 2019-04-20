import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, 
  Content,Text,List,ListItem,Card,CardItem,Badge ,Footer, FooterTab,Item,Input} from "native-base";
import {   AsyncStorage ,StyleSheet,RefreshControl,Alert,ListView,View,FlatList} from 'react-native';
import localhost from "../components/localhost";
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from "react-native-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
var db = openDatabase({name: 'task.db', createFromLocation: '~Database.db'})/*ประกาศตัวแปร SQLite ให้สามารถเรียกใช้ได้*/

export default class ShowTask extends React.Component { 
    state = {
      dataSource: '',
      task_id:'',
      title: '',
      detail: '',
      email:'',
      isLoading: true,
      visibleModal: null,
      cancel: null,
      cancelText:null,
      task:null,
      refreshing:false
     };



_loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem('email');
      if (value  !== null){
        this.setState({email: value});
        const { email } = this.state;
        alert(email);
          fetch('http://'+localhost+'/GProject/viewtask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email : email,
      })

      }).then((response) => response.json())
          .then((responseJson) => {
         let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
          task:true,

        });
       }).catch((error) => {
        this.setState({ task:null,
        });
      });
      } else {
        this.setState({email: '', task:null,
      });
      }
    } catch (error) {
      this.setState({email: '', task:null,
    });
    }
  };
  componentDidMount() {
    this._loadInitialState().done();
  }

  _refreshControl(){
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={()=>this._refreshListView()} />
    )
  }
  _refreshListView(){
    this.setState({refreshing:true})
    const { email } = this.state;
          fetch('http://'+localhost+'/GProject/viewtask.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email : email, 
          })
          }).then((response) => response.json())
              .then((responseJson) => { 
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              dataSource: ds.cloneWithRows(responseJson),
              refreshing:false
            });
          }).catch((error) => {
            this.setState({isLoading: true,refreshing:false
            }) 

          });
  }
 
  view(rowData) {
    this.setState({ visibleModal: 1 })
    const {visibleModal} = this.state
    if(visibleModal == 1){
      this.setState({ task_id: rowData.task_id,
                       title: rowData.title,
                       detail:rowData.detail})

    }
  } 

  submitTask = () => {/**หาก User กดปุ่ม รับงาน หมายถึง User รับงานที่ได้รับการ assign เขามา */
    var id  = this.state.task_id
    var title  =this.state.title;
    var detail  = this.state.detail;
    var email =this.state.email;
    var that = this;
    /**ประกาศตัวแปร เพื่อรับค่า Parameter จากหน้า ShowTask.js */
    fetch('http://'+localhost+'/GProject/submitTask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : id,
      })

      }).then((response) => response.json())
          .then((responseJson) => {
            Alert.alert(responseJson);
            var id  = this.state.task_id;
            fetch('http://'+localhost+'/GProject/tracking.php', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id : id,/**ส่งตัวแปร เข้าไปหน้า tracking.php เพื่อใช้ในการ query */
              })
              }).then((response) => response.json())
                  .then((responseJson) => {/**เมื่อ User รับงานแล้ว ข้อมูลจาก mysql จะถูก save เก็บไว้ในรูปแบบ SQLite เพื่อรองรับการทำงานแบบ Offline */
                    this.setState({visibleModal: false});
                    db.transaction(function(tx) {
                      tx.executeSql(
                        'INSERT INTO task (task_id,task_title,task_detail,user_email) VALUES (?,?,?,?)',
                        [id,title,detail,email],
                        (tx, results) => {
                          if (results.rowsAffected > 0) {
                            Alert.alert(
                              'Success',
                              'You are submit successfully',
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
                            alert('submit Failed');
                          }
                        }
                      );
                    });
                  }).catch((error) => {
                    console.error(error);}); 
          }).catch((error) => {
            console.error(error);
          });}

 cancelTask = () => {/**หาก User เลือก ไม่รับงาน นั้นหมายถึง User ไม่ต้องการรับงานที่ได้ Assign เข้ามา  */
  this.setState({cancel:true}) 
  const {cancelText} = this.state
  if (cancelText != null){
    var id  = this.state.task_id;
    var input =this.state.cancelText;/** เหตุผลที่ User ไม่รับงาน */
    var that = this;
    fetch('http://'+localhost+'/GProject/cancelTask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : id,
        message:input/** ส่งค่าทั้งหมดไปยังหน้า cancelTask.php เพื่อเอาไว้ใช้ในการ query */
      })

      }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({visibleModal: false});
            Alert.alert(
              responseJson,
              'You are submit successfully',
              [
                {
                  text: 'Ok',

                  onPress: () =>
                  that.props.navigation.navigate('UserInfo'),
                },
              ],
              { cancelable: false }
            );

          }).catch((error) => {
            console.error(error);
          });

  }
            
  }

  renderModalContent = () => (
    <View style={styles.modalContent}>  
    <Button iconLeft transparent primary style={{alignSelf: 'flex-end',}} onPress={() => this.setState({ visibleModal: null })}>
              <Icon name='md-close' />
        </Button>  
        <CardItem  header bordered>
        <Text>รายละเอียดงาน</Text>
        </CardItem>
        <CardItem bordered>
        <Text>{this.state.detail}</Text>
        </CardItem>
        <CardItem footer bordered>   
        <Left>
        <Button small  success onPress={_ => this.submitTask(this)}><Text> รับงาน </Text></Button>
        </Left>
        <Right>
        <Button small  danger  onPress={_ => this.cancelTask(this)}><Text> ไม่รับงาน </Text></Button>
        </Right>
        </CardItem>
        {this.state.cancel ? (
          <Item error>
        <Input placeholder='โปรดระบุเหตุผล' onChangeText={cancelText => this.setState({cancelText})}/>

          <Icon name='close-circle' />
        </Item>
                  ) : null}

        
    
    </View>
  );


  render() {
    const{isLoading} = this.state;
    if(isLoading == false){
      screen= 
      <View>   
      <List>
      </List>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={rowData => (
              <ListItem thumbnail>
              <Body>
                <Text>Title</Text>
                <Text note numberOfLines={1}>{rowData.title}</Text>
              </Body>
              <Right>
                <Button transparent 
                onPress={() => this.setState({ task_id: rowData.task_id,
                title: rowData.title,detail:rowData.detail,visibleModal:1})}>
                  <Text>View</Text>
                </Button>
              </Right>
            </ListItem>
        )}/>
            <Modal
              isVisible={this.state.visibleModal === 1}>
              {this.renderModalContent()}
            </Modal>
        </View>
    }else{
      screen =  
      <View>   
      <List>
        <ListItem>
        <Body>
          <Text>คุณยังไม่ได้รับการมอบหมายงานในขณะนี้</Text>
        </Body>
        </ListItem>
      </List>
      </View>
             
    }
    return (
        <Container>
       <HeaderImageScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require("../images/headercolor.jpg")}
      renderForeground={() => (
      <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
            <Text style={{color: '#ffff', fontSize:20 }}>งานใหม่</Text>
        </View>
      )}
        >
      
        <Content> 
        <RefreshControl
         refreshing={this.state.refreshing}
         onRefresh={()=>this._refreshListView()}>
        <ListItem itemDivider>
        <Text>รายการงานที่ยังไม่ได้รับ</Text>
        </ListItem> 
   
                {screen}  
        </RefreshControl> 
        </Content>
        </HeaderImageScrollView>
        <Footer>
          <FooterTab>
            <Button badge vertical>
              <Badge><Text>2</Text></Badge>
              <Icon name="apps" />
            </Button>
            <Button active badge vertical>
              <Badge ><Text>51</Text></Badge>
              <Icon active name="md-notifications" />
            </Button>
            <Button vertical  onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name="menu" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
 
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },

});

