import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const FolderDisplaySection = ({ outputFolder, setOutputFolder }) => {
  const handlePickFolder = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });

      if (result?.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const folderPath = fileUri.substring(0, fileUri.lastIndexOf("/"));
        setOutputFolder(folderPath);
      } else {
        console.log("No file selected or user cancelled.");
      }
    } catch (error) {
      console.error("Error picking folder:", error);
    }
  };

  const { width } = useWindowDimensions();
  const unit = clamp(Math.round(width * 0.01), 2, 16);
  const controlHeight = Math.max(36, Math.round(unit * 2.6));

  return (
    <View style={[styles.fullSection, { padding: unit, marginBottom: Math.round(unit * 0.75) }]}>
      {/* Inline label + button */}
      <View style={[styles.inlineRow, { columnGap: Math.round(unit * 0.6), rowGap: Math.round(unit * 0.6), marginBottom: Math.round(unit * 0.6) }]}>
        <Text style={styles.headingInline}>Program Output Folder:</Text>
        <TouchableOpacity
          style={[
            styles.folderButton,
            {
              paddingHorizontal: unit,
              paddingVertical: Math.round(unit * 0.6),
              minHeight: controlHeight,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={handlePickFolder}
        >
          <Text style={styles.folderButtonText}>Select Folder</Text>
        </TouchableOpacity>
      </View>

      {/* Folder display row */}
      <View style={[styles.fileDisplay, { columnGap: Math.round(unit * 0.5) }]}>
        <MaterialIcons name="folder" size={24} color="#28a745" />
        <Text style={styles.fileText} numberOfLines={1} ellipsizeMode="middle">
          {outputFolder
            ? outputFolder.split("/").filter(Boolean).pop()
            : "No folder selected"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullSection: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  headingInline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    alignSelf: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  fileDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileText: {
    color: "#334155",
    fontSize: 14,
    flex: 1,
    minWidth: 0,
  },
  folderButton: {
    backgroundColor: "#28a745",
    borderRadius: 6,
  },
  folderButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default FolderDisplaySection;
