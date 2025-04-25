import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
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
    // Optionally trigger any logic here when Enter is pressed
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainBox}>
        <Image source={require("../../assets/icon1.png")} style={styles.logo} />

        <View style={styles.sectionsRow}>
          <CADSourceSection
            tmrNumber={tmrNumber}
            setTmrNumber={setTmrNumber}
            selectedCADFile={selectedCADFile}
            setSelectedCADFile={setSelectedCADFile}
          />

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
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  mainBox: {
    width: "100%",
    maxWidth: 950,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
    marginBottom: 20,
  },
  sectionsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
});

export default MainScreen;
