import Icon from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import { useSelector } from 'react-redux'
import { COLORS } from '../Constant/Color'
import Icon1 from 'react-native-vector-icons/AntDesign'
import database from '@react-native-firebase/database';
import { Badge } from 'react-native-elements'
import storage from '@react-native-firebase/storage';
const HomeHeader = ({ navigation }) => {
    const [BadgeCount, getBadgeCount] = useState(0)
    const { userData } = useSelector(state => state.User);
    const [getimage, setimage] = useState("")
    useEffect(() => {
        getChatlist();
        database()
            .ref('/users/' + userData?.id)
            .on('value', snapshot => {
                loadimage(snapshot.val().img)
            });
    }, []);
    const loadimage = async (image) => {
        setimage(await storage().ref(image).getDownloadURL())
    }
    const getChatlist = async () => {
        database()
            .ref('/chatlist/' + userData?.id)
            .on('value', snapshot => {
                if (snapshot.val() != null) {
                    const item = Object.values(snapshot.val())
                    let s = 0;
                    for (var i = 0; i < item.length; i++) {
                        if (item[i].notifi) {
                            s++;
                        }
                        getBadgeCount(s)
                    }
                }
                else {
                    getBadgeCount(0)
                }
            });
    }
    return (
        <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            padding: 10, paddingHorizontal: 15, backgroundColor: COLORS.white, elevation: 2, paddingVertical: 15
        }}>
            <Text style={styles.logo}>APP CHAT</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon1
                    name='message1'
                    size={35}
                />
                <>
                    {
                        BadgeCount != 0 ?
                            <Badge
                                status="error"
                                value={BadgeCount}
                                containerStyle={{ right: 12, top: -10 }}
                            /> :
                            <></>
                    }
                </>

            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
            >
                <Avatar
                    source={{ uri: getimage?getimage:"https://i.ytimg.com/vi/jH7e1fDcZnY/maxresdefault.jpg" }}
                    rounded
                    size='medium' />
            </TouchableOpacity>
        </View>
    )
}

export default HomeHeader;

const styles = StyleSheet.create({
    logo: {
        fontWeight: 'bold',
        color: COLORS.theme,
        fontSize: 35,
    },
})
