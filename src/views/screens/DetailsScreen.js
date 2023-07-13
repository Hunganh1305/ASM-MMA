import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../../consts/colors";
import Plants from "../../consts/plants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsScreen = ({ navigation, route }) => {
  const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
  const [favData, setFavData] = useState([]);
  const getOrchidId = route.params.id;
  const chosenOrchid = Plants.find((item) => item.id === getOrchidId);
  const item = route.params;

  useEffect(() => {
    getFromStorage();
  }, []);

  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem("favorite");
    setFavData(data != null ? JSON.parse(data) : []);
  };

  const setDataToStorage = async () => {
    let list;
    if (favData == []) {
      list = [getOrchidId];
      await AsyncStorage.setItem("favorite", JSON.stringify(list));
    } else {
      list = [...favData, getOrchidId];
      await AsyncStorage.setItem("favorite", JSON.stringify(list));
    }
    setFavData(list);
  };

  const removeDataFromStorage = async () => {
    const list = favData.filter((item) => item !== getOrchidId);
    await AsyncStorage.setItem("favorite", JSON.stringify(list));
    setFavData(list);
  };

  function animatedButton() {
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    if (favData.includes(chosenOrchid.id)) {
      removeDataFromStorage();
    } else {
      setDataToStorage();
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Details</Text>
      </View>
      <View style={{ top: -48, right: -350 }}>
        <Pressable
          onPress={() => {
            navigation.navigate("home");
          }}
        >
          <Icon name="home-filled" size={28} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 280,
          }}
        >
          <Image source={item.image} style={{ height: 220, width: 220 }} />
        </View>
        <View style={style.details}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", color: COLORS.white }}
            >
              {item.name}
            </Text>
            <TouchableWithoutFeedback onPress={animatedButton}>
              <Animated.View
                style={[
                  style.iconContainer,
                  { transform: [{ scale: scaleValue }] },
                ]}
              >
                {favData.includes(chosenOrchid.id) ? (
                  <Icon name="favorite" color={COLORS.red} size={25} />
                ) : (
                  <Icon
                    name="favorite-border"
                    color={COLORS.primary}
                    size={25}
                  />
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={style.detailsText}>{item.description}</Text>
          <View style={{ marginTop: 40, marginBottom: 40 }}>
            <View style={style.bottomText}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                ${item.price}
              </Text>
              <Text
                style={{ color: COLORS.white, fontSize: 18, fontWeight: 600 }}
              >
                {item.rating}{" "}
                <AntDesign name="star" color={COLORS.yellow} size={20} />
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
    color: COLORS.white,
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DetailsScreen;
