# Utility Controller Module

> Enhancing functionality with essential utility operations

## 📁 Module Summary

This module provides utility functions for handling image uploads and serving, enhancing the overall functionality of the Safe Sri Lanka application.

## 🔧 Module Overview

The Utility Controller is a vital component of the Safe Sri Lanka application, designed to:

- **Handle Image Uploads**: Securely process and store user-uploaded images
- **Serve Images**: Efficiently retrieve and serve stored images
- **Manage File Operations**: Perform various file-related tasks to support application features

### 🌟 Key Features

- **Base64 Image Processing**: Converts base64-encoded image data for storage and retrieval
- **Random Filename Generation**: Ensures unique filenames for uploaded images
- **File System Integration**: Interacts with the local file system for image storage
- **Error Handling**: Robust error management for all file operations
- **Content Type Detection**: Automatically detects and sets appropriate content types for images

### 🛠️ Core Functions

The `utilController.bal` file implements the following main functions:

1. `uploadImage(string base64Image) returns json|error`
   - Processes base64-encoded image data
   - Generates a unique filename
   - Saves the image to the local file system
   - Returns success status or error information

2. `serveImage(json payload) returns json|error`
   - Retrieves requested image file
   - Converts image to base64 for transmission
   - Returns image data or error if not found

### 📊 Implementation Details

- Utilizes Ballerina's `random`, `array`, `io`, and `file` modules
- Implements secure file writing and reading operations
- Converts between base64 and byte array representations of images
- Provides detailed error messages for troubleshooting

### 🔗 API Usage

#### Upload Image



