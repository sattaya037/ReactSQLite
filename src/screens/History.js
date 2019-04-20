/*Screen to view all the user*/
import React from 'react';
import { AsyncStorage,FlatList, View ,RefreshControl,StyleSheet} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
  Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox ,Badge ,Footer, FooterTab} from "native-base";
import { openDatabase } from 'react-native-sqlite-storage';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from "react-native-modal";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
var db = openDatabase({ name: 'history.db', createFromLocation : '~Database.db'});

//Connction to access the pre-populated user_db.db

export default class History extends React.Component {
  state = {
      FlatListItems: [],
      email:'',
      visibleModal: null,
      task_id:'',
      task_title:'',
      task_detail:'',
      start_time:'',
      finish_time:'',
      refreshing:false,

    };
  
  _loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem('email');
      if (value  !== null){
        this.setState({email: value});
        const { email } = this.state;
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM history WHERE user_email=?', [email], (tx, results) => {
            var temp = [];
            if(temp){
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              this.setState({
                FlatListItems: temp,
              });
            }else{
              this.setState({
                FlatListItems:false,
              });            
            }
          });
        });
          } else {
            this.setState({email: ''});
          }
        } catch (error) {
          this.setState({  email: ''});
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
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM history WHERE user_email=?', [email], (tx, results) => {
          var temp = [];
          if(temp){
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              FlatListItems: temp,
              refreshing:false,

            });
          }else{
            this.setState({
              FlatListItems:false,
              refreshing:false,

            });            
          }
        });
      });
       
  }

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };

  renderContent() {
    let Content;
    if(this.state.FlatListItems == false) {
      Content =    
        <ListItem >
        <Text>ไม่มีประวัติการทำงาน</Text>
      </ListItem> 
        
   }else{
    Content =    
        <View>
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card>
          <List>
            <ListItem avatar>
              <Body>
              <Text>Title:{item.task_title}</Text>
              <Text note>finish:{item.finish_time}</Text>
              </Body>
              <Right>
              <Button small  info  
                onPress={() => this.setState({ task_id: item.task_id,user_email:item.user_email,
                  task_title: item.task_title,task_detail:item.task_detail,start_time:item.start_time,finish_time:item.finish_time,visibleModal:1})}>
                  <Text>View</Text>
                </Button>
              </Right>
            </ListItem>
          </List>
          </Card>
          )}/>
             <Modal
              isVisible={this.state.visibleModal === 1}>
              {this.renderModalContent()}
            </Modal>
      </View>
          
    }   
      return Content;
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
        <Text>{this.state.task_detail}</Text>
        </CardItem>
        <CardItem footer bordered>   
        <Left>
        <Text>เวลาเริ่มงาน: {this.state.start_time}</Text>
        </Left>
        <Right>
        <Text>เวลาเสร็จงาน: {this.state.finish_time}</Text>
        </Right>
        </CardItem>
    </View>
  );



  render() {
    return (
      <Container>
     <HeaderImageScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require("../images/headercolor.jpg")}
      renderForeground={() => (
      <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
            <Text style={{color: '#ffff', fontSize:20 }}>ประวัติการทำงาน</Text>
        </View>
      )}
        >
    <Content> 
    <RefreshControl
         refreshing={this.state.refreshing}
         onRefresh={()=>this._refreshListView()}>
        <ListItem itemDivider>
          <Text>ประวัติการทำงาน</Text>
        </ListItem>    
          {this.renderContent()}
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

