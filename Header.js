import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { primaryColor, primaryTextColor } from "./Colors";

const Header = ({ date }) => {
  return (
    <View style={styles.header}>
      {/* <Icon
          name="chevrons-left"
          size={30}
          color="#900"
          onPress={() => handleDateChange(-1)}
        /> */}
      <Text style={{ fontSize: 16, color: primaryTextColor, fontWeight: "bold" }}>
        {/* {new Date(parseInt(date)).toLocaleDateString(undefined, {
          weekday: "short",
          month: "long",
          day: "numeric"
        })} */}
        What do you need to do today?
      </Text>
      {/* <Icon
          name="chevrons-right"
          size={30}
          color="#900"
          onPress={() => handleDateChange(1)}
        /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
    width: "100%",
    height: 50,
    // paddingTop: "5%",
    // paddingBottom: 5
  }
});

export default Header;
