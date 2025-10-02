import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const FileDisplaySection = ({ selectedCADFile }) => {
  const { width } = useWindowDimensions();
  const unit = clamp(Math.round(width * 0.01), 2, 16);
  return (
    <View style={[styles.fullSection, { padding: unit, marginBottom: Math.round(unit * 0.75) }]}>
      <Text style={[styles.heading, { marginBottom: Math.round(unit * 0.6) }]}>Selected CAD file:</Text>
      <View style={[styles.fileDisplay, { columnGap: Math.round(unit * 0.5) }]}>
        <MaterialIcons 
          name={selectedCADFile ? "insert-drive-file" : "info-outline"}
          size={24}
          color={selectedCADFile ? "#007BFF" : "#64748b"}
        />
        <View style={styles.fileInfo}>
          <Text style={styles.fileText} numberOfLines={1} ellipsizeMode="middle">
            {selectedCADFile?.name || "No CAD file selected"}
          </Text>
          {selectedCADFile?.size && (
            <Text style={styles.fileSize}>
              {formatFileSize(selectedCADFile.size)}
            </Text>
          )}
          {selectedCADFile?.uri && (
            <Text style={styles.filePath}>
              {selectedCADFile.uri}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const styles = StyleSheet.create({
  fullSection: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  fileDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileInfo: {
    flex: 1,
  },
  fileText: {
    color: "#334155",
    fontSize: 14,
    flexShrink: 1,
  },
  fileSize: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  filePath: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default FileDisplaySection;
