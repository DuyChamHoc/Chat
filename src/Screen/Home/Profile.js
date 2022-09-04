import React, { useState, useEffect, useTransition } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Pressable, Image, Dimensions, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from "react-native-vector-icons/FontAwesome"
import Icon2 from "react-native-vector-icons/EvilIcons"
import { Avatar, Button } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { colors, paremeter } from '../../Component/Constant/style'
import DatetimePicker from "@react-native-community/datetimepicker"
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
export default function Profile() {
    const [getname, setname] = useState("");
    const [getphone, setphone] = useState("");
    const [getsex, setsex] = useState("");
    const [getdate, setdate] = useState("")
    const [getaddress, setaddres] = useState("");
    const [getname1, setname1] = useState("");
    const [getphone1, setphone1] = useState("");
    const [getsex1, setsex1] = useState("");
    const [getdate1, setdate1] = useState("")
    const [getaddress1, setaddres1] = useState("");
    const { userData } = useSelector(state => state.User);
    const [selectedValue, setSelectedValue] = useState("");
    const [modalVisible, setModalVisible] = useState(false)
    const [datetime, setdatetime] = useState(new Date());
    const [mode, setmode] = useState('date');
    const [show, setShow] = useState(false);
    const [getimage, setimage] = useState("")
    useEffect(() => {
        database()
            .ref('/users/' + userData?.id)
            .on('value', snapshot => {
                setname(snapshot.val().name)
                setphone(snapshot.val().phone)
                setdate(snapshot.val().birthday)
                setsex(snapshot.val().sex)
                setaddres(snapshot.val().address)
                loadimage(snapshot.val().img)
            });
    })
    const loadimage = async (image) => {
        setimage(await storage().ref(image).getDownloadURL())
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setdatetime(currentDate);
        setdate1(currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear());
    };
    const showMode = (currentMode) => {
        setShow(true);
        setmode(currentMode);
    };

    const showDatepicker = () => {
        showMode("date");
    };
    const upload = () => {
        let myData = {
            name: getname1,
            phone: getphone1,
            birthday: getdate1,
            sex: getsex1,
            address: getaddress1,
        };
        database()
            .ref('/users/' + userData?.id)
            .update(myData)
            .then(() =>
                console.log('Data updated.')
            );
        setname1("")
        setphone1("")
        setdate1("")
        setsex1("")
        setaddres1("")
        setModalVisible(false)
    }
    const uploadimage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            setimage(image.path);
            submitImage(image.path);
        });
    }
    const submitImage = async (image) => {
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        try {
            await storage().ref(filename).putFile(uploadUri);
            database()
                .ref('/users/' + userData?.id)
                .update({
                    img: filename
                })
                .then(() =>
                    console.log('Data updated.')
                );
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ backgroundColor: colors.backgroundColor }}>
                    <View style={styles.avatarView}>
                        <Avatar
                            size={100}
                            rounded
                            avatarStyle={styles.avatar}
                            source={{ uri:getimage?getimage:"https://i.ytimg.com/vi/jH7e1fDcZnY/maxresdefault.jpg" }}
                        />
                        <View style={{ marginLeft: 90, marginTop: -20 }}>
                            <Icon2
                                size={40}
                                name='camera'
                                onPress={() => {
                                    uploadimage()
                                }}
                                style={{ color: colors.text }}
                            />
                        </View>
                        <Text style={{ color: colors.text, fontSize: 20 }}>
                            {getname}
                        </Text>
                    </View>
                </View>
                <View style={{ backgroundColor: colors.backgroundColor, width: "100%", height: '45%', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginRight: 10, marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 17, fontWeight: 'bold', }}>Thông tin cá nhân</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'red' }}>Sửa</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={
                                {
                                    borderRadius: 40,
                                    padding: 35,
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5,
                                    backgroundColor: "#6BC8FF"
                                }
                            }>
                                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} >
                                    <Icon1
                                        size={30}
                                        name="close"
                                        style={{ marginLeft: 320, marginTop: -20, color: colors.text }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Cập nhật thông tin</Text>
                                <View style={{ marginTop: 15, }}>
                                    <TextInput
                                        style={{
                                            width: 320,
                                            borderWidth: 1,
                                            borderColor: "#86939e",
                                            marginHorizontal: 20,
                                            borderRadius: 12,
                                            marginBottom: 20,
                                            paddingHorizontal: 10,
                                            color: 'black',
                                        }}
                                        placeholder='Your name'
                                        value={getname1}
                                        onChangeText={(value) => setname1(value)}
                                    />
                                    <TextInput
                                        style={{
                                            width: 320,
                                            borderWidth: 1,
                                            borderColor: "#86939e",
                                            marginHorizontal: 20,
                                            borderRadius: 12,
                                            marginBottom: 20,
                                            paddingHorizontal: 10,
                                            color: colors.text,
                                        }}
                                        placeholder="Phone Number"
                                        value={getphone1}
                                        onChangeText={(value) => setphone1(value)}
                                    />
                                    <View style={{ width: 320, flexDirection: 'row' }}>
                                        <TextInput
                                            style={{
                                                width: 150,
                                                borderWidth: 1,
                                                borderColor: "#86939e",
                                                marginHorizontal: 20,
                                                borderRadius: 12,
                                                marginBottom: 2,
                                                paddingHorizontal: 10,
                                                color: colors.text,
                                            }}
                                            placeholder="Date of Birth"
                                            value={getdate1}
                                            onChangeText={(value) => setdate1(value)}
                                        />
                                        <Icon
                                            size={30}
                                            name="calendar"
                                            style={{ marginLeft: 10, marginTop: 10, color: colors.text }}
                                            onPress={showDatepicker}
                                        />
                                        {show && (
                                            <DatetimePicker
                                                testID="dateTimePicker"
                                                value={datetime}
                                                mode={mode}
                                                is24Hour={true}
                                                display="default"
                                                onChange={onChange}
                                            />
                                        )}
                                    </View>
                                    <View style={{
                                        height: 50,
                                        width: 150,
                                        borderWidth: 1,
                                        borderColor: "#86939e",
                                        marginHorizontal: 20,
                                        borderRadius: 12,
                                        marginBottom: 20,
                                        marginTop: 20,
                                        paddingHorizontal: 5,
                                        justifyContent: 'center',
                                    }}>
                                        <Picker
                                            selectedValue={selectedValue}
                                            style={{
                                                color: colors.text,
                                            }}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setSelectedValue(itemValue);
                                                setsex1(itemValue)
                                            }}
                                        >
                                            <Picker.Item label="Nam" value="Nam" />
                                            <Picker.Item label="Nữ" value="Nữ" />
                                        </Picker>
                                    </View>
                                    <TextInput
                                        style={{
                                            width: 320,
                                            borderWidth: 1,
                                            borderColor: "#86939e",
                                            marginHorizontal: 20,
                                            borderRadius: 12,
                                            marginBottom: 20,
                                            paddingHorizontal: 10,
                                            color: colors.text,
                                        }}
                                        placeholder="Your address"
                                        value={getaddress1}
                                        onChangeText={(value) => setaddres1(value)}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        upload()
                                    }}
                                    style={{ alignContent: "center", borderRadius: 20, height: 45, width: 250, backgroundColor: 'blue', marginLeft: 8, justifyContent: "center", alignItems: "center" }}
                                >
                                    <Text style={{ color: 'white', fontWeight: "bold", fontSize: 15 }}>Lưu thông tin</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <View style={styles.viewInfo}>
                            <Image
                                source={{ uri: "https://cdn2.iconfinder.com/data/icons/thin-line-color-1/21/38-256.png" }}
                                style={{ height: 30, width: 30, marginLeft: 20, marginTop: 5 }}
                            />
                            <View style={{ justifyContent: 'center', marginEnd: 5, marginLeft: 10 }}>

                                <Text style={{ color: colors.text }}>Tên người dùng</Text>
                                <Text style={{ color: colors.text, marginTop: 5 }}>{getname}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.viewInfo}>
                            <Image
                                source={{ uri: "https://cdn3.iconfinder.com/data/icons/blue-line-interface/64/contact-256.png" }}
                                style={{ height: 30, width: 30, marginLeft: 20, marginTop: 5 }}
                            />
                            <View style={{ justifyContent: 'center', marginEnd: 5, marginLeft: 10 }}>
                                <Text style={{ color: colors.text }}>Số điện thoại</Text>
                                <Text style={{ color: colors.text, marginTop: 5 }} >{getphone}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.viewInfo}>
                            <Image
                                source={{ uri: "https://cdn4.iconfinder.com/data/icons/aircraft-blue-line/64/165_schedule-calendar-date-256.png" }}
                                style={{ height: 30, width: 30, marginLeft: 20, marginTop: 5 }}
                            />
                            <View style={{ justifyContent: 'center', marginEnd: 5, marginLeft: 10 }}>
                                <Text style={{ color: colors.text }}>Ngày sinh</Text>
                                <Text style={{ color: colors.text, marginTop: 5 }} >{getdate}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.viewInfo}>
                            <Image
                                source={{ uri: "https://cdn4.iconfinder.com/data/icons/lgbt-6/64/bigender-sex-gender-shapes-256.png" }}
                                style={{ height: 30, width: 30, marginLeft: 20, marginTop: 5 }}
                            />
                            <View style={{ justifyContent: 'center', marginEnd: 5, marginLeft: 10 }}>
                                <Text style={{ color: colors.text }}>Giới tính</Text>
                                <Text style={{ color: colors.text, marginTop: 5 }} >{getsex}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.address}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 5 }}>
                        <Text style={{ color: colors.text, marginLeft: 15, fontSize: 16, fontWeight: "bold" }}>Sổ địa chỉ</Text>
                        <TouchableOpacity >
                            <Text style={{ color: 'red', marginRight: 15, fontSize: 16, fontWeight: "bold" }}>Địa chỉ đã lưu</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Image
                            source={{ uri: "https://cdn4.iconfinder.com/data/icons/universal-7/614/17_-_Location-256.png" }}
                            style={{ height: 30, width: 30, marginLeft: 20 }}
                        />
                        <View style={{ width: "85%", marginLeft: 5, marginTop: 5 }}>
                            <Text style={{ fontSize: 16, color: colors.text }}>{getaddress}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarView: {
        alignItems: 'center',
        marginTop: 20,
    },
    styleImgItem: {
        height: "65%",
        marginLeft: 10,
        resizeMode: "contain",
        marginTop: 10,
    },
    viewItem: {
        backgroundColor: colors.backgroundColor,
        height: 50,
        width: '48%',
        borderRadius: 5,
        paddingHorizontal: 10,
        shadowRadius: 2,
        flexDirection: "row",
        borderWidth: 1,
    },
    viewInfo: {
        flexDirection: 'row',
        marginTop: 20,
        alignContent: 'center',
    },
    address: {
        backgroundColor: colors.backgroundColor,
        marginTop: 10,
        width: '100%',
        height: 170,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textinput3: {
        width: 320,
        borderWidth: 1,
        borderColor: "#86939e",
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
})