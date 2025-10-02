import React, { useState } from "react";
import { View, Image, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import CADSourceSection from "../components/CADSourceSection";
import SettingsSection from "../components/SettingsSection";
import FileDisplaySection from "../components/FileDisplaySection";
import FolderDisplaySection from "../components/FolderDisplaySection";
import CreateButton from "../components/CreateButton";

const MainScreen = () => {
  const [tmrNumber, setTmrNumber] = useState("");
  const [manualHeight, setManualHeight] = useState("1550");
  const [selectedColors, setSelectedColors] = useState({
    red: false,
    blue: false,
    black: true,
  });
  const [selectedCADFile, setSelectedCADFile] = useState(null);
  const [outputFolder, setOutputFolder] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState("manual");

  const handleHeightSelection = (value) => {
    setSelectedHeight(value);
    if (value !== "manual") setManualHeight(value);
  };

  const submitManualHeight = () => {
    console.log("Manual height submitted:", manualHeight);
  };

  const { width, height } = useWindowDimensions();
  const isNarrow = width < 980;
  const gutter = Math.max(8, Math.round(width * 0.012));

  return (
    <ScrollView
      contentContainerStyle={[styles.screenContainer, { minHeight: height }]}
      showsVerticalScrollIndicator={false}
    >
      <View nativeID="app-content">
        <View style={styles.mainBox}>
          <Image source={require("../../assets/icon1.png")} style={styles.logo} />

          <View style={styles.sectionsRow}>
            <View
              style={[
                styles.sectionItem,
                isNarrow ? styles.sectionFull : styles.sectionHalf,
                isNarrow ? styles.sectionStackSpacing : { paddingRight: Math.floor(gutter / 2) },
              ]}
            >
              <CADSourceSection
                tmrNumber={tmrNumber}
                setTmrNumber={setTmrNumber}
                selectedCADFile={selectedCADFile}
                setSelectedCADFile={setSelectedCADFile}
              />
            </View>

            <View
              style={[
                styles.sectionItem,
                isNarrow ? styles.sectionFull : styles.sectionHalf,
                isNarrow ? undefined : { paddingLeft: Math.ceil(gutter / 2) },
              ]}
            >
              <SettingsSection
                manualHeight={manualHeight}
                setManualHeight={setManualHeight}
                submitManualHeight={submitManualHeight}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedHeight={selectedHeight}
                handleHeightSelection={handleHeightSelection}
              />
            </View>
          </View>

          <FileDisplaySection selectedCADFile={selectedCADFile} />
          <FolderDisplaySection
            outputFolder={outputFolder}
            setOutputFolder={setOutputFolder}
          />
          <CreateButton
            tmrNumber={tmrNumber}
            selectedCADFile={selectedCADFile}
            manualHeight={manualHeight}
            selectedHeight={selectedHeight}
            selectedColors={selectedColors}
            outputFolder={outputFolder}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#f8fafc",
    padding: 0,
  },
  mainBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
    marginBottom: 4,
    alignSelf: "center",
  },
  sectionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    alignItems: "stretch",
  },
  sectionItem: {
    minWidth: 0,
  },
  sectionFull: {
    width: "100%",
  },
  sectionHalf: {
    width: "50%",
  },
  sectionStackSpacing: {
    marginBottom: 8,
  },
});

export default MainScreen;
