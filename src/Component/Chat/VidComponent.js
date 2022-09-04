import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import storage from '@react-native-firebase/storage';
import TimeDelivery from './TimeDelivery';
import Video from 'react-native-video';
export default function VidComponent({ sender, item }) {
    const [video, setvideo] = useState('')
    useEffect(() => {
        loadvideo()
    })
    const loadvideo = async () => {
        setvideo(await storage().ref(item.message).getDownloadURL())
    }
    return (
        <View
            style={[{
                borderRadius:10,
                margin: 10,
                alignItems: sender ? 'flex-end' : 'flex-start',
            }]}
        >
            <Video
                controls={true}
                style={{ width: 200, height: 150,borderRadius:10 }}
                source={{ uri: video }}
            />
            <TimeDelivery
                sender={sender}
                item={item}
            />
        </View>
    )
}