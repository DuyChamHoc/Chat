import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import { COLORS } from '../../Component/Constant/Color';
import { FONTS } from '../../Component/Constant/Font';
import database from '@react-native-firebase/database';
import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import moment from 'moment';
const AllUser = ({ navigation }) => {
  const { userData } = useSelector(state => state.User);
  const [search, setsearch] = useState('');
  const [allUser, setallUser] = useState([]);
  const [allUserBackup, setallUserBackup] = useState([]);
  const [loading, setloading] = useState(false);
  const [pageCurrent, setpageCurrent] = useState(1);
  useEffect(() => {
    setloading(true);
    getAllUser();
  }, [pageCurrent]);

  const getAllUser = () => {
    database()
      .ref('users/')
      .once('value')
      .then(snapshot => {
        setallUser(
          Object.values(snapshot.val()).filter(it => it.id != userData.id),
        );
        setallUserBackup(
          Object.values(snapshot.val()).filter(it => it.id != userData.id),
        );
        setloading(false);
      });
    setloading(false);
  };

  const searchuser = val => {
    setsearch(val);
    setallUser(allUserBackup.filter(it => it.name.match(val)));
  };

  const createChatList = data => {
    database()
      .ref('/chatlist/' + userData.id + '/' + data.id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() == null) {
          let roomId = uuid.v4();
          let myData = {
            roomId,
            id: userData.id,
            name: userData.name,
            img: userData.img,
            emailId: userData.emailId,
            about: userData.about,
            lastMsg: '',
            notifi: false,
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
          };
          database()
            .ref('/chatlist/' + data.id + '/' + userData.id)
            .update(myData)
            .then(() => console.log('Data updated.'));

          delete data['password'];
          data.lastMsg = '';
          data.roomId = roomId;
          data.notifi = false;
          data.time = moment().format('MMMM Do YYYY, h:mm:ss a');
          database()
            .ref('/chatlist/' + userData.id + '/' + data.id)
            .update(data)
            .then(() => console.log('Data updated.'));

          navigation.navigate('SingleChat', { receiverData: data });
        } else {
          navigation.navigate('SingleChat', { receiverData: snapshot.val() });
        }
      });
  };

  const renderItem = ({ item }) => (
    <ListItem
      onPress={() => createChatList(item)}
      bottomDivider
      containerStyle={styles.listStyle}>
      <Avatar
        source={{ uri: item.img }}
        rounded
        title={item.name}
        size="medium"
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontFamily: FONTS.Medium, fontSize: 14 }}>
          {item.name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ fontFamily: FONTS.Regular, fontSize: 12 }}
          numberOfLines={1}>
          {item.about}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
  const renderFooter = () => {
    return (
      loading ?
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View> : null
    )
  }
  const handleLoadMore = () => {
    setpageCurrent(pageCurrent + 1);
    setloading(true);
  }
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar
          placeholder="Search by name..."
          onChangeText={val => searchuser(val)}
          value={search}
          autoCapitalize="none"
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={allUser}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1.2}
      />
      <TouchableOpacity
        style={{ height: 50, width: 80, backgroundColor: '#40E0D0', borderRadius: 20,justifyContent:'center',alignItems:'center',margin:25 }}
        onPress={() => navigation.navigate("Home")}>
        <Text style={{fontWeight:'bold',color:'white',fontSize:18}}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllUser;

const styles = StyleSheet.create({
  searchContainer: {
    borderRadius: 20,
    elevation: 2,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 15,
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    opacity: 0.7,
  },
  listStyle: { paddingVertical: 7, marginVertical: 2 },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
});
