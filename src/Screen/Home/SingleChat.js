import Icon from 'react-native-vector-icons/Ionicons';
import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  SectionList,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import MsgComponent from '../../Component/Chat/MsgComponent';
import { COLORS } from '../../Component/Constant/Color';
import ChatHeader from '../../Component/Header/ChatHeader';
import { useSelector } from 'react-redux';
import database from '@react-native-firebase/database';
import SimpleToast from 'react-native-simple-toast';
import Icon1 from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import ImgComponent from '../../Component/Chat/ImgComponent';
import VidComponent from '../../Component/Chat/VidComponent';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import RecordComponent from '../../Component/Chat/RecordComponent';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const audioRecorderPlayer = new AudioRecorderPlayer();
const SingleChat = props => {
  const [getload, setload] = useState(false)
  const [getloadvoice, setloadvoice] = useState(false)
  const { userData } = useSelector(state => state.User);
  const { receiverData } = props.route.params;
  const [msg, setMsg] = React.useState('');
  const [allChat, setallChat] = React.useState([]);
  const [getimage, setimage] = useState(null)
  const onStartRecord = async () => {
    setloadvoice(true)
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addPlayBackListener((e) => {
    })
  }
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();;
    uploadRecord(result)
  };
  const uploadRecord = async (record) => {
    const uploadUri = record;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1) + Math.random();
    try {
      await storage().ref(filename).putFile(uploadUri);
      database()
        .ref('/messages/' + receiverData.roomId)
        .once('value')
        .then(snapshot => {
          if (snapshot.val() == null) {
            const newReference = database().ref('/messages/' + receiverData.roomId).push();
            let group = {
              timegroup: moment().format('LLLL'),
              check: true
            }
            newReference
              .set(group)
              .then(() => {
                const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                let msgData = {
                  roomId: receiverData.roomId,
                  message: filename,
                  from: userData?.id,
                  to: receiverData.id,
                  sendTime: moment().format('LLLL'),
                  msgType: 'record',
                  check: false,
                };
                msgData.id = newReference1.key;
                newReference1
                  .set(msgData)
                  .then(() => {
                    let chatListupdate = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:true,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    let chatListupdate1 = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:false,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    database()
                      .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                      .update(chatListupdate)
                      .then(() => console.log('Data updated.'));
                    database()
                      .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                      .update(chatListupdate1)
                      .then(() => console.log('Data updated.'));

                    setMsg('');
                  });
              })
          }
          else {
            database()
              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
              .once('value')
              .then(snapshot => {
                if (moment(snapshot.val().sendTime).format('MMMM Do YYYY, h') == moment().format('MMMM Do YYYY, h')) {
                  let a = moment().format('mm') - moment(snapshot.val().sendTime).format('mm')
                  if (a > 5) {
                    const newReference = database().ref('/messages/' + receiverData.roomId).push();
                    let group = {
                      timegroup: moment().format('LLLL'),
                      check: true
                    }
                    newReference
                      .set(group)
                      .then(() => {
                        const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                        let msgData = {
                          roomId: receiverData.roomId,
                          message: filename,
                          from: userData?.id,
                          to: receiverData.id,
                          sendTime: moment().format('LLLL'),
                          msgType: 'record',
                          check: false,
                        };
                        msgData.id = newReference1.key;
                        newReference1
                          .set(msgData)
                          .then(() => {
                            let chatListupdate = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:true,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            let chatListupdate1 = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:false,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            database()
                              .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                              .update(chatListupdate)
                              .then(() => console.log('Data updated.'));
                            database()
                              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                              .update(chatListupdate1)
                              .then(() => console.log('Data updated.'));

                            setMsg('');
                          });
                      })
                  }
                  else {
                    const newReference2 = database().ref('/messages/' + receiverData.roomId).push();
                    let msgData1 = {
                      roomId: receiverData.roomId,
                      message: filename,
                      from: userData?.id,
                      to: receiverData.id,
                      sendTime: moment().format('LLLL'),
                      msgType: 'record',
                      check: false,
                    };
                    msgData1.id = newReference2.key;
                    newReference2
                      .set(msgData1)
                      .then(() => {
                        let chatListupdate = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:true,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        let chatListupdate1 = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:false,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        database()
                          .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                          .update(chatListupdate)
                          .then(() => console.log('Data updated.'));
                        database()
                          .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                          .update(chatListupdate1)
                          .then(() => console.log('Data updated.'));
                        setMsg('');
                      });
                  }
                }
                else {
                  const newReference = database().ref('/messages/' + receiverData.roomId).push();
                  let group = {
                    timegroup: moment().format('LLLL'),
                    check: true
                  }
                  newReference
                    .set(group)
                    .then(() => {
                      const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                      let msgData = {
                        roomId: receiverData.roomId,
                        message: filename,
                        from: userData?.id,
                        to: receiverData.id,
                        sendTime: moment().format('LLLL'),
                        msgType: 'record',
                        check: false,
                      };
                      msgData.id = newReference1.key;
                      newReference1
                        .set(msgData)
                        .then(() => {
                          let chatListupdate = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:true,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          let chatListupdate1 = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:false,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          database()
                            .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                            .update(chatListupdate)
                            .then(() => console.log('Data updated.'));
                          database()
                            .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                            .update(chatListupdate1)
                            .then(() => console.log('Data updated.'));

                          setMsg('');
                        });
                    })
                }
              });
          }
        });
    } catch (e) {
      console.log(e);
    }
    setloadvoice(false)
  }

  useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/' + receiverData.roomId)
      .on('child_added', snapshot => {
        setallChat((state) => [snapshot.val(), ...state]);
      });
    return () => database().ref('/messages' + receiverData.roomId).off('child_added', onChildAdd);
  }, []);
  const msgvalid = txt => txt && txt.replace(/\s/g, '').length;

  const sendMsg = () => {
    if (msg == '' || msgvalid(msg) == 0) {
      SimpleToast.show('Enter something....');
      return false;
    }
    database()
      .ref('/messages/' + receiverData.roomId)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() == null) {
          const newReference = database().ref('/messages/' + receiverData.roomId).push();
          let group = {
            timegroup: moment().format('LLLL'),
            check: true
          }
          newReference
            .set(group)
            .then(() => {
              const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
              let msgData = {
                roomId: receiverData.roomId,
                message: msg,
                from: userData?.id,
                to: receiverData.id,
                sendTime: moment().format('LLLL'),
                msgType: 'text',
                check: false,
              };
              msgData.id = newReference1.key;
              newReference1
                .set(msgData)
                .then(() => {
                  let chatListupdate = {
                    lastMsg: msg,
                    sendTime: msgData.sendTime,
                    notifi:true,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                  };
                  let chatListupdate1 = {
                    lastMsg: msg,
                    sendTime: msgData.sendTime,
                    notifi:false,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                  };
                  database()
                    .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                    .update(chatListupdate)
                    .then(() => console.log('Data updated.'));
                  database()
                    .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                    .update(chatListupdate1)
                    .then(() => console.log('Data updated.'));

                  setMsg('');
                });
            })
        }
        else {
          database()
            .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
            .once('value')
            .then(snapshot => {
              if (moment(snapshot.val().sendTime).format('MMMM Do YYYY, h') == moment().format('MMMM Do YYYY, h')) {
                let a = moment().format('mm') - moment(snapshot.val().sendTime).format('mm')
                if (a > 5) {
                  const newReference = database().ref('/messages/' + receiverData.roomId).push();
                  let group = {
                    timegroup: moment().format('LLLL'),
                    check: true
                  }
                  newReference
                    .set(group)
                    .then(() => {
                      const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                      let msgData = {
                        roomId: receiverData.roomId,
                        message: msg,
                        from: userData?.id,
                        to: receiverData.id,
                        sendTime: moment().format('LLLL'),
                        msgType: 'text',
                        check: false,
                      };
                      msgData.id = newReference1.key;
                      newReference1
                        .set(msgData)
                        .then(() => {
                          let chatListupdate = {
                            lastMsg: msg,
                            sendTime: msgData.sendTime,
                            notifi:true,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          let chatListupdate1 = {
                            lastMsg: msg,
                            sendTime: msgData.sendTime,
                            notifi:false,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          database()
                            .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                            .update(chatListupdate)
                            .then(() => console.log('Data updated.'));
                          database()
                            .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                            .update(chatListupdate1)
                            .then(() => console.log('Data updated.'));

                          setMsg('');
                        });
                    })
                }
                else {
                  const newReference2 = database().ref('/messages/' + receiverData.roomId).push();
                  let msgData1 = {
                    roomId: receiverData.roomId,
                    message: msg,
                    from: userData?.id,
                    to: receiverData.id,
                    sendTime: moment().format('LLLL'),
                    msgType: 'text',
                    check: false,
                  };
                  msgData1.id = newReference2.key;
                  newReference2
                    .set(msgData1)
                    .then(() => {
                      let chatListupdate = {
                        lastMsg: msg,
                        sendTime: msgData1.sendTime,
                        notifi:true,
                        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      };
                      let chatListupdate1 = {
                        lastMsg: msg,
                        sendTime: msgData1.sendTime,
                        notifi:false,
                        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      };
                      database()
                        .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                        .update(chatListupdate)
                        .then(() => console.log('Data updated.'));
                      database()
                        .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                        .update(chatListupdate1)
                        .then(() => console.log('Data updated.'));
                      setMsg('');
                    });
                }
              }
              else {
                const newReference = database().ref('/messages/' + receiverData.roomId).push();
                let group = {
                  timegroup: moment().format('LLLL'),
                  check: true
                }
                newReference
                  .set(group)
                  .then(() => {
                    const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                    let msgData = {
                      roomId: receiverData.roomId,
                      message: msg,
                      from: userData?.id,
                      to: receiverData.id,
                      sendTime: moment().format('LLLL'),
                      msgType: 'text',
                      check: false,
                    };
                    msgData.id = newReference1.key;
                    newReference1
                      .set(msgData)
                      .then(() => {
                        let chatListupdate = {
                          lastMsg: msg,
                          sendTime: msgData.sendTime,
                          notifi:true,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        let chatListupdate1 = {
                          lastMsg: msg,
                          sendTime: msgData.sendTime,
                          notifi:false,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        database()
                          .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                          .update(chatListupdate)
                          .then(() => console.log('Data updated.'));
                        database()
                          .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                          .update(chatListupdate1)
                          .then(() => console.log('Data updated.'));

                        setMsg('');
                      });
                  })
              }
            });
        }
      });
  };

  const uploadimage = () => {
    setload(true)
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      setimage(image.path);
      submitImage(image.path);
    });
  }
  const uploadvideo = () => {
    setload(true)
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      submitVideo(video.path)
    });
  }
  const submitImage = async (image) => {
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    try {
      await storage().ref(filename).putFile(uploadUri);
      database()
        .ref('/messages/' + receiverData.roomId)
        .once('value')
        .then(snapshot => {
          if (snapshot.val() == null) {
            const newReference = database().ref('/messages/' + receiverData.roomId).push();
            let group = {
              timegroup: moment().format('LLLL'),
              check: true
            }
            newReference
              .set(group)
              .then(() => {
                const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                let msgData = {
                  roomId: receiverData.roomId,
                  message: filename,
                  from: userData?.id,
                  to: receiverData.id,
                  sendTime: moment().format('LLLL'),
                  msgType: 'image',
                  check: false,
                };
                msgData.id = newReference1.key;
                newReference1
                  .set(msgData)
                  .then(() => {
                    let chatListupdate = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:true,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    let chatListupdate1 = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:false,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    database()
                      .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                      .update(chatListupdate)
                      .then(() => console.log('Data updated.'));
                    database()
                      .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                      .update(chatListupdate1)
                      .then(() => console.log('Data updated.'));

                    setMsg('');
                  });
              })
          }
          else {
            database()
              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
              .once('value')
              .then(snapshot => {
                if (moment(snapshot.val().sendTime).format('MMMM Do YYYY, h') == moment().format('MMMM Do YYYY, h')) {
                  let a = moment().format('mm') - moment(snapshot.val().sendTime).format('mm')
                  if (a > 5) {
                    const newReference = database().ref('/messages/' + receiverData.roomId).push();
                    let group = {
                      timegroup: moment().format('LLLL'),
                      check: true
                    }
                    newReference
                      .set(group)
                      .then(() => {
                        const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                        let msgData = {
                          roomId: receiverData.roomId,
                          message: filename,
                          from: userData?.id,
                          to: receiverData.id,
                          sendTime: moment().format('LLLL'),
                          msgType: 'image',
                          check: false,
                        };
                        msgData.id = newReference1.key;
                        newReference1
                          .set(msgData)
                          .then(() => {
                            let chatListupdate = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:true,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            let chatListupdate1 = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:false,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            database()
                              .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                              .update(chatListupdate)
                              .then(() => console.log('Data updated.'));
                            database()
                              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                              .update(chatListupdate1)
                              .then(() => console.log('Data updated.'));

                            setMsg('');
                          });
                      })
                  }
                  else {
                    const newReference2 = database().ref('/messages/' + receiverData.roomId).push();
                    let msgData1 = {
                      roomId: receiverData.roomId,
                      message: filename,
                      from: userData?.id,
                      to: receiverData.id,
                      sendTime: moment().format('LLLL'),
                      msgType: 'image',
                      check: false,
                    };
                    msgData1.id = newReference2.key;
                    newReference2
                      .set(msgData1)
                      .then(() => {
                        let chatListupdate = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:true,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        let chatListupdate1 = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:false,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        database()
                          .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                          .update(chatListupdate)
                          .then(() => console.log('Data updated.'));
                        database()
                          .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                          .update(chatListupdate1)
                          .then(() => console.log('Data updated.'));
                        setMsg('');
                      });
                  }
                }
                else {
                  const newReference = database().ref('/messages/' + receiverData.roomId).push();
                  let group = {
                    timegroup: moment().format('LLLL'),
                    check: true
                  }
                  newReference
                    .set(group)
                    .then(() => {
                      const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                      let msgData = {
                        roomId: receiverData.roomId,
                        message: filename,
                        from: userData?.id,
                        to: receiverData.id,
                        sendTime: moment().format('LLLL'),
                        msgType: 'image',
                        check: false,
                      };
                      msgData.id = newReference1.key;
                      newReference1
                        .set(msgData)
                        .then(() => {
                          let chatListupdate = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:true,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          let chatListupdate1 = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:false,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          database()
                            .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                            .update(chatListupdate)
                            .then(() => console.log('Data updated.'));
                          database()
                            .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                            .update(chatListupdate1)
                            .then(() => console.log('Data updated.'));

                          setMsg('');
                        });
                    })
                }
              });
          }
        });
    } catch (e) {
      console.log(e);
    }
    setload(false)
  }
  const submitVideo = async (video) => {
    const uploadUri = video;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    try {
      await storage().ref(filename).putFile(uploadUri);
      database()
        .ref('/messages/' + receiverData.roomId)
        .once('value')
        .then(snapshot => {
          if (snapshot.val() == null) {
            const newReference = database().ref('/messages/' + receiverData.roomId).push();
            let group = {
              timegroup: moment().format('LLLL'),
              check: true
            }
            newReference
              .set(group)
              .then(() => {
                const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                let msgData = {
                  roomId: receiverData.roomId,
                  message: filename,
                  from: userData?.id,
                  to: receiverData.id,
                  sendTime: moment().format('LLLL'),
                  msgType: 'video',
                  check: false,
                };
                msgData.id = newReference1.key;
                newReference1
                  .set(msgData)
                  .then(() => {
                    let chatListupdate = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:true,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    let chatListupdate1 = {
                      lastMsg: filename,
                      sendTime: msgData.sendTime,
                      notifi:false,
                      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    };
                    database()
                      .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                      .update(chatListupdate)
                      .then(() => console.log('Data updated.'));
                    database()
                      .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                      .update(chatListupdate1)
                      .then(() => console.log('Data updated.'));

                    setMsg('');
                  });
              })
          }
          else {
            database()
              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
              .once('value')
              .then(snapshot => {
                if (moment(snapshot.val().sendTime).format('MMMM Do YYYY, h') == moment().format('MMMM Do YYYY, h')) {
                  let a = moment().format('mm') - moment(snapshot.val().sendTime).format('mm')
                  if (a > 5) {
                    const newReference = database().ref('/messages/' + receiverData.roomId).push();
                    let group = {
                      timegroup: moment().format('LLLL'),
                      check: true
                    }
                    newReference
                      .set(group)
                      .then(() => {
                        const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                        let msgData = {
                          roomId: receiverData.roomId,
                          message: filename,
                          from: userData?.id,
                          to: receiverData.id,
                          sendTime: moment().format('LLLL'),
                          msgType: 'video',
                          check: false,
                        };
                        msgData.id = newReference1.key;
                        newReference1
                          .set(msgData)
                          .then(() => {
                            let chatListupdate = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:true,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            let chatListupdate1 = {
                              lastMsg: filename,
                              sendTime: msgData.sendTime,
                              notifi:false,
                              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            };
                            database()
                              .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                              .update(chatListupdate)
                              .then(() => console.log('Data updated.'));
                            database()
                              .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                              .update(chatListupdate1)
                              .then(() => console.log('Data updated.'));

                            setMsg('');
                          });
                      })
                  }
                  else {
                    const newReference2 = database().ref('/messages/' + receiverData.roomId).push();
                    let msgData1 = {
                      roomId: receiverData.roomId,
                      message: filename,
                      from: userData?.id,
                      to: receiverData.id,
                      sendTime: moment().format('LLLL'),
                      msgType: 'video',
                      check: false,
                    };
                    msgData1.id = newReference2.key;
                    newReference2
                      .set(msgData1)
                      .then(() => {
                        let chatListupdate = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:true,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        let chatListupdate1 = {
                          lastMsg: filename,
                          sendTime: msgData1.sendTime,
                          notifi:false,
                          time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        };
                        database()
                          .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                          .update(chatListupdate)
                          .then(() => console.log('Data updated.'));
                        database()
                          .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                          .update(chatListupdate1)
                          .then(() => console.log('Data updated.'));
                        setMsg('');
                      });
                  }
                }
                else {
                  const newReference = database().ref('/messages/' + receiverData.roomId).push();
                  let group = {
                    timegroup: moment().format('LLLL'),
                    check: true
                  }
                  newReference
                    .set(group)
                    .then(() => {
                      const newReference1 = database().ref('/messages/' + receiverData.roomId).push();
                      let msgData = {
                        roomId: receiverData.roomId,
                        message: filename,
                        from: userData?.id,
                        to: receiverData.id,
                        sendTime: moment().format('LLLL'),
                        msgType: 'video',
                        check: false,
                      };
                      msgData.id = newReference1.key;
                      newReference1
                        .set(msgData)
                        .then(() => {
                          let chatListupdate = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:true,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          let chatListupdate1 = {
                            lastMsg: filename,
                            sendTime: msgData.sendTime,
                            notifi:false,
                            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                          };
                          database()
                            .ref('/chatlist/' + receiverData?.id + '/' + userData?.id)
                            .update(chatListupdate)
                            .then(() => console.log('Data updated.'));
                          database()
                            .ref('/chatlist/' + userData?.id + '/' + receiverData?.id)
                            .update(chatListupdate1)
                            .then(() => console.log('Data updated.'));

                          setMsg('');
                        });
                    })
                }
              });
          }
        });
    } catch (e) {
      console.log(e);
    }
    setload(false)
  }
  return (
    <View style={styles.container}>
      <ChatHeader data={receiverData} />
      <ImageBackground
        source={require('../../Assets/Background.jpg')}
        style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={allChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          renderItem={({ item }) => {
            return (
              <>
                {item.check ?
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: 'white' }}>{item.timegroup}</Text>
                  </View>
                  :
                  <>{item.msgType == 'image' ?
                    <ImgComponent sender={item.from == userData.id} item={item} />
                    :
                    <>{item.msgType == 'video' ?
                      <VidComponent sender={item.from == userData.id} item={item} />
                      :
                      <>
                        {item.msgType == 'record' ?
                          <RecordComponent sender={item.from == userData.id} item={item} /> :
                          <MsgComponent sender={item.from == userData.id} item={item} />
                        }
                      </>
                    }</>
                  }</>}
              </>
            );
          }}
        />
        <>
          {
            getload ?
              <SkeletonPlaceholder>
                <View
                  style={[{
                    margin: 10,
                    alignItems: 'flex-end'
                  }]}
                >
                  <View
                    style={{ width: 200, height: 150, borderRadius: 10 }}
                  />
                  <View
                    style={{ width: 145, height: 10, marginTop: 5, borderRadius: 3 }}
                  />
                </View>
              </SkeletonPlaceholder>
              :
              <></>
          }
        </>
        <>
          {
            getloadvoice ?
              <SkeletonPlaceholder>
                <View
                  style={[{
                    borderRadius: 20,
                    margin: 10,
                    alignItems: 'flex-end',
                  }]}
                >
                  <View
                    style={{ width: 200, height: 60, borderRadius: 30 }}
                  />
                  <View
                    style={{ width: 145, height: 10, marginTop: 5, borderRadius: 3, marginRight: 5 }}
                  />
                </View>
              </SkeletonPlaceholder> :
              <></>
          }
        </>
      </ImageBackground>

      <View
        style={{
          backgroundColor: COLORS.theme,
          elevation: 5,
          // height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={{
            backgroundColor: COLORS.white,
            width: '50%',
            borderRadius: 25,
            borderWidth: 0.5,
            borderColor: COLORS.white,
            paddingHorizontal: 15,
            color: COLORS.black,
          }}
          placeholder="type a message"
          placeholderTextColor={COLORS.black}
          multiline={true}
          value={msg}
          onChangeText={val => setMsg(val)}
        />
        <TouchableOpacity
          onPress={() => {
            uploadimage()
          }}
        >
          <Icon1
            name='images'
            style={{
              fontSize: 30,
              color: COLORS.white,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => uploadvideo()}
        >
          <Icon1
            name='video'
            style={{
              fontSize: 30,
              color: COLORS.white,
            }}

          />
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() =>
            onStartRecord()}
          onPressOut={
            () =>
              onStopRecord()
          }
        >
          <Icon2
            name='keyboard-voice'
            style={{
              fontSize: 30,
              color: COLORS.white,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMsg}>
          <Icon
            style={{
              fontSize: 40,
              color: COLORS.white,
            }}
            name="paper-plane-sharp"
            type="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SingleChat;
