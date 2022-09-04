import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import storage from '@react-native-firebase/storage';
import TimeDelivery from './TimeDelivery';

export default function ImgComponent({ sender, item }) {
    const [image, setimage] = useState('')
    useEffect(() => {
        loadimage()
    })
    const loadimage = async () => {
        setimage(await storage().ref(item.message).getDownloadURL())
    }
    return (
        <View
            style={[{
                borderRadius:10,
                margin:10,
                alignItems: sender ? 'flex-end' : 'flex-start',
            }]}
        >
            <ImageBackground
                style={{ width: 200, height: 150,borderRadius:10 }}
                source={{ uri: image }}
            />
            <TimeDelivery
                    sender={sender}
                    item={item}
                />
        </View>
    )
}