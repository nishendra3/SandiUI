import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const CreateButton = ({
  tmrNumber,
  selectedCADFile,
  manualHeight,
  selectedHeight,
  selectedColors,
  outputFolder
}) => {
  const handleCreate = () => {
    const selectedColor = Object.keys(selectedColors).find(color => selectedColors[color]);

    const consolidatedData = {
      tmrNumber,
      selectedCADFileName: selectedCADFile?.name || null,
      railHeight: selectedHeight === "manual" ? manualHeight : selectedHeight,
      color: selectedColor,
      outputFolder,
    };

    console.log("Form Data Submitted:", JSON.stringify(consolidatedData, null, 2));
  };

  const { width } = useWindowDimensions();
  const unit = clamp(Math.round(width * 0.01), 2, 16);

  return (
    <TouchableOpacity style={[styles.createButton, { padding: Math.round(unit * 0.8), marginTop: Math.round(unit * 0.25) }]} onPress={handleCreate}>
      <MaterialIcons name="check-circle" size={24} color="white" />
      <Text style={styles.createText}>Create</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  createText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateButton;
