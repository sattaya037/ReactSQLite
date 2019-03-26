import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,List,ListItem,Card,CardItem } from "native-base";
import {   Alert ,ImageBackground,StyleSheet,ListView,View,FlatList} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import localhost from "../components/localhost";

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'task.db', createFromLocation: '~Database.db'})

export default class TaskDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isDialogVisible: false,

    }
  }

  
  submitTask = () => {
    this.setState({isDialogVisible: false});

    var id  = this.props.navigation.state.params.taskID;
    var status ="submit";
    var title  =this.props.navigation.state.params.taskTitle;
    var detail  = this.props.navigation.state.params.taskDetail;
    var email =this.props.navigation.state.params.userEmail;
    var that = this;
    fetch('http://'+localhost+'/GProject/submitTask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : id,
        status : status,
      })

      }).then((response) => response.json())
          .then((responseJson) => {
            Alert.alert(responseJson);
            var id  = this.props.navigation.state.params.taskID;
            fetch('http://'+localhost+'/GProject/tracking.php', {
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
                    db.transaction(function(tx) {
                      tx.executeSql(
                        'INSERT INTO task (task_id,task_title,task_detail,user_email) VALUES (?,?,?,?)',
                        [id,title,detail,email],
                        (tx, results) => {
                          console.log('Results', results.rowsAffected);
                          if (results.rowsAffected > 0) {
                            Alert.alert(
                              'Success',
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
                          } else {
                            alert('submit Failed');
                          }
                        }
                      );
                    });

                  }).catch((error) => {
                    console.error(error);
                  }); 

         
          }).catch((error) => {
            console.error(error);
          });

  }
  cancelTask = () => {
    this.setState({isDialogVisible: true});

    
  }

  sendInput= (inputText) => {
    var id  = this.props.navigation.state.params.taskID;
    var status ="cancel";
    var input =inputText;
    var that = this;
    fetch('http://'+localhost+'/GProject/cancelTask.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : id,
        status : status,
        message:input
      })

      }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({isDialogVisible: false});
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




  render() {
    var check = this.state.isDialogVisible;
    if(check==true){
      dialog= 
      <View style={styles.container}>
      <DialogInput isDialogVisible={this.state.isDialogVisible}
                  title={"เหตุผลที่ไม่รับงาน"}
                  message={"โปรดระบุเหตุผลที่ไม่รับงานนี้"}
                  submitInput={ (inputText) => {this.sendInput(inputText,this)} }
                  closeDialog={ () => {this.cancelTask(false)}}>
      </DialogInput>
   
    </View>}
    else{
      dialog=<View>

      </View>
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
            <Button transparent onPress={() => this.props.navigation.navigate("UserInfo")}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>รายละเอียดงาน </Title>
          </Body>
          <Right>
            <Button transparent onPress={() =>this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content padder>
      
      <Card>
            <CardItem header bordered>
              <Text>Title:{this.props.navigation.state.params.taskTitle}</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                Detail:
                {this.props.navigation.state.params.taskDetail}
                </Text>
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>{this.props.navigation.state.params.taskID}</Text>
            </CardItem>
                <CardItem>
                <Left>
                <Button block success onPress={_ => this.submitTask(this)}>
                        <Text>Submit</Text>
                    </Button>
                </Left>
                <Right>
                <Button block danger  onPress={_ => this.cancelTask(this)}>
                        <Text>cancel</Text>
                    </Button>
                </Right>
                </CardItem>
          </Card>
          {dialog}
        </Content>
        </ImageBackground>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
