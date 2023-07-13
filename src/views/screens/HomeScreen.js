import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../../consts/colors";
import categories from "../../consts/categories";
import plants from "../../consts/plants";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;

const HomeScreen = ({ navigation }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const [chosenCate, setChosenCate] = useState("c0");

  const [data, setData] = useState(
    plants.filter((item) => item.categoryId == "c0")
  );

  const [text, setText] = useState("");

  const [favData, setFavData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem("favorite");
    setFavData(data != null ? JSON.parse(data) : []);
  };

  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setChosenCate(category.id);
              setSelectedCategoryIndex(index);
              setData(plants.filter((item) => item.categoryId === category.id));
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...style.categoryBtn,
              }}
            >
              <View style={style.categoryBtnImgCon}>
                <Image
                  source={category.image}
                  style={{ height: 35, width: 35, resizeMode: "cover" }}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 10,
                  color:
                    selectedCategoryIndex == index
                      ? COLORS.white
                      : COLORS.primary,
                }}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const Card = ({ plant }) => {
    const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
    const getOrchidId = plant.id;
    const chosenOrchid = data.find((item) => item.id === getOrchidId);

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
      <TouchableHighlight underlayColor={COLORS.white} activeOpacity={0.9}>
        <View style={style.card}>
          <Pressable
            onPress={() => {
              navigation.navigate("DetailsScreen", plant);
            }}
          >
            <View style={{ alignItems: "center", top: -40 }}>
              <Image source={plant.image} style={{ height: 130, width: 130 }} />
            </View>
          </Pressable>

          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {plant.name}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ${plant.price}
            </Text>
            <TouchableWithoutFeedback onPress={animatedButton}>
              <Animated.View
                style={[
                  style.iconContainer,
                  { transform: [{ scale: scaleValue }] },
                ]}
              >
                {favData.includes(plant.id) ? (
                  <View style={style.like}>
                    <Icon
                      name="favorite"
                      size={20}
                      style={{
                        color: COLORS.red,
                      }}
                    />
                  </View>
                ) : (
                  <View style={style.like}>
                    <Icon
                      name="favorite"
                      size={20}
                      style={{
                        color: COLORS.white,
                      }}
                    />
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 28 }}>Orchid</Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "600",
                marginLeft: 10,
                color: "#19E4D1",
              }}
            >
              Florist
            </Text>
          </View>
        </View>
        <Image
          source={require("../../assets/lisa.jpg")}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View style={style.inputContainer}>
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Search for plant"
            value={text}
            onChangeText={(data) => {
              setText(data);
            }}
          />
        </View>
        <Pressable
          onPress={() => {
            if (text != "") {
              const result = data.filter((item) => item.name.includes(text));
              setText("");
              setData(result);
            } else {
              setData(plants.filter((item) => item.categoryId === chosenCate));
            }
          }}
        >
          <View style={style.sortBtn}>
            <Icon name="search" size={28} color={COLORS.white} />
          </View>
        </Pressable>
      </View>
      <View>
        <ListCategories />
      </View>
      {data.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={data}
          renderItem={({ item }) => <Card plant={item} />}
        />
      ) : (
        <View style={style.emptyContainer}>
          <Image
            style={style.emptyImage}
            source={require("../../assets/EmptyOrchid.png")}
          />
          <Text style={style.emptyText}>Preparing to update new Orchid</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: COLORS.light,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 150,
    marginRight: 7,
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  like: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
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

export default HomeScreen;
