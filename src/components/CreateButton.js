import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

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

  return (
    <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
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
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  createText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateButton;
