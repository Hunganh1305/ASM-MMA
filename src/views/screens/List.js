import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../consts/colors";
import plants from "../../consts/plants";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const List = ({ navigation }) => {
  const [favData, setFavData] = useState([]);

  const isFocused = useIsFocused();

  let dataFav;
  if (favData != null) {
    dataFav = plants.filter((plant) => favData.includes(plant.id));
  } else {
    dataFav = [];
  }

  useEffect(() => {
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const storageData = await AsyncStorage.getItem("favorite");
    setFavData(storageData != null ? JSON.parse(storageData) : []);
    if (favData != null && storageData != null) {
      dataFav = plants.filter((plan) =>
        JSON.parse(storageData).includes(plan.id)
      );
    } else {
      dataFav = [];
    }
  };

  const removeAllStorage = async () => {
    Alert.alert("Are you sure?", "You are removing all your favorite", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          AsyncStorage.clear();
          setFavData([]);
          dataFav = [];
        },
      },
    ]);
  };

  const CartCard = ({ item }) => {
    const getOrchidId = item.id;
    const chosenOrchid = dataFav.find((item) => item.id === getOrchidId);

    const removeDataFromStorage = async () => {
      const list = favData.filter((item) => item !== getOrchidId);
      await AsyncStorage.setItem("favorite", JSON.stringify(list));
      setFavData(list);
    };
    return (
      <View style={style.cartCard}>
        <Pressable
          onPress={() => {
            navigation.navigate("DetailsScreen", item);
          }}
        >
          <Image source={item.image} style={{ height: 80, width: 80 }} />
        </Pressable>
        <View
          style={{
            height: 100,
            marginLeft: 10,
            paddingVertical: 20,
            flex: 1,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
          <Text style={{ fontSize: 13, color: COLORS.grey }}>
            {item.ingredients}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            ${item.price}
          </Text>
          <View style={{ top: -30, right: -230 }}>
            <Pressable
              onPress={() => {
                removeDataFromStorage();
              }}
            >
              <EvilIcons name="trash" size={28} color="black" />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            marginRight: 20,
            backgroundColor: COLORS.primary,
            width: 55,
            height: 30,
            borderRadius: 10,
            top: -34,
            right: -28,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              textAlign: "center",
              padding: 2,
            }}
          >
            {item.rating}{" "}
            <AntDesign name="star" color={COLORS.white} size={16} />
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your List</Text>
      </View>
      {dataFav.length !== 0 ? (
        <>
          <TouchableOpacity
            style={{ marginLeft: 30 }}
            onPress={removeAllStorage}
          >
            <Text
              style={{
                fontSize: 18,
                color: "rgba(0, 0, 0, 0.5)",
                marginBottom: 10,
              }}
            >
              Clear all
            </Text>
          </TouchableOpacity>
          <Animatable.View animation="slideInRight" duration={1000}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
              data={dataFav}
              renderItem={({ item }) => <CartCard item={item} />}
            />
          </Animatable.View>
        </>
      ) : (
        <View style={style.emptyContainer}>
          <Image
            style={style.emptyImage}
            source={require("../../assets/EmptyBox.png")}
          />
          <Text style={style.emptyText}>What is your favorite Orchid?</Text>
        </View>
      )}
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
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  emptyContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: "70%",
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 20,
  },
});

export default List;
