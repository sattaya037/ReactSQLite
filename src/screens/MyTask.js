/*Screen to view all the user*/
import React from 'react';
import { AsyncStorage,FlatList, View ,RefreshControl} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text,
  Accordion ,List,ListItem,Card,CardItem ,Thumbnail,CheckBox ,Badge ,Footer, FooterTab} from "native-base";
import { openDatabase } from 'react-native-sqlite-storage';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
//Connction to access the pre-populated user_db.db
var db = openDatabase({ name: 'task.db', createFromLocation : '~Database.db'});

export default class MyTask extends React.Component {
    state = {
      FlatListItems: [],
      email:'',
      refreshing:false,

    };
  
  _loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem('email');
      if (value  !== null){
        this.setState({email: value});
        const { email } = this.state;
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM task WHERE user_email=?', [email], (tx, results) => {
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
        tx.executeSql('SELECT * FROM task WHERE user_email=?', [email], (tx, results) => {
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
  doTask = (item) => {

     this.props.navigation.navigate('DoTask', {
       MyTaskID: item.task_id,
       MyTaskTitle: item.task_title,
       MyTaskDetail: item.task_detail,
       MyUserEmail: item.user_email,

     });

  }

  renderContent() {
    let Content;
    if(this.state.FlatListItems == false) {
      Content =    
        <ListItem >
        <Text>ไม่มีงานที่สามารถรับได้ในขณะนี้</Text>
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
              <ListItem thumbnail>
              <Body>
                <Text>Title</Text>
                <Text note numberOfLines={1}>{item.task_title}</Text>
              </Body>
              <Right>
              <Button small  info onPress={_ => this.doTask(item)}>
                <Text> ทำงาน </Text>
              </Button>
              </Right>
            </ListItem>
          </List>
          </Card>
          )}/>
      </View>
          
    }   
      return Content;
  }


  render() {
    return (
      <Container>
     <HeaderImageScrollView
      maxHeight={200}
      minHeight={100}
      headerImage={require("../images/headercolor.jpg")}
      renderForeground={() => (
      <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
            <Text style={{color: '#ffff', fontSize:20 }}>งานของฉัน</Text>
        </View>
      )}
        >
    <Content> 
      <RefreshControl
         refreshing={this.state.refreshing}
         onRefresh={()=>this._refreshListView()}>
        <ListItem itemDivider>
          <Text>รายการงาน</Text>
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