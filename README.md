-----

# ✨ SmartScan Rivai ✨

Seamless document scanning and management for PT PLN ULP Rivai.

-----

## 🌟 Overview

SmartScan Rivai is a cross-platform document scanner application designed to revolutionize document management at PT PLN (Persero) Unit Layanan Pelanggan (ULP) Rivai. Leveraging **Optical Character Recognition (OCR)** technology, this application aims to significantly enhance the efficiency, accuracy, and ease of digitizing and organizing critical administrative and operational documents.

Traditional scanning processes at ULP Rivai involved manual file naming, reliance on third-party applications plagued by ads, and cumbersome file transfers via flash drives. SmartScan Rivai addresses these challenges head-on by providing an integrated, ad-free solution that automates text recognition, streamlines document categorization, and ensures direct storage into a centralized admin dashboard.

Whether on an **Android device (for mobile scanning)** or a **desktop application built with Electron.js (for desktop access)**, SmartScan Rivai empowers employees with a flexible and intuitive tool, simplifying workflows and boosting productivity.

-----

## 💡 Key Features

  * **Cross-Platform Compatibility:** Access SmartScan Rivai seamlessly on Android devices for mobile scanning and as a dedicated desktop application built with Electron.js for desktop management.
  * **Integrated OCR Technology:** Automatically recognize text within scanned documents, facilitating intelligent detection of Customer IDs and document categories.
  * **Automated Document Categorization:** Say goodbye to manual input\! OCR helps in automatically selecting document categories, reducing human error and saving time.
  * **Direct Integration with Admin Dashboard:** Scanned documents are immediately stored in a centralized system, eliminating the need for manual file transfers and allowing for easy access.
  * **Ad-Free Experience:** Enjoy an uninterrupted scanning experience, designed specifically for PT PLN ULP Rivai without disruptive third-party advertisements.
  * **Streamlined Workflow:** Accelerate administrative processes by simplifying document scanning, storage, and retrieval, enhancing overall work efficiency.

-----

## 🎯 Project Goals

This project was developed with the following objectives:

1.  To build a robust cross-platform document scanning application with Optical Character Recognition (OCR) to simplify document scanning at PT PLN Unit Layanan Pelanggan Rivai.
2.  To facilitate easier document scanning, storage, and access for employees via both Android devices and the desktop application.

-----

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm/yarn installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bmsptra24/smartscan-rivai.git
    cd smartscan-rivai
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

This project uses **Expo React Native** and **Electron.js** for desktop builds.

  * **For Development (Expo Dev Client):**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Scan the QR code with your Expo Go app or a dev client.

  * **For Production Builds:**

      * **Android Development Client:**
        ```bash
        npm run prod:android:dev-client
        ```
      * **Android Production Build (Local):**
        ```bash
        npm run prod:android
        ```
      * **Desktop Builds (Linux/Windows - via Electron.js):**
        Refer to `scripts/build-desktop.sh`, `scripts/build-linux.sh`, and `scripts/build-win.sh` for details on how the Electron.js desktop application is built.
        ```bash
        # Example for Linux desktop application
        npm run prod:linux
        # To run the built Linux desktop application (after building)
        npm run start:linux
        ```
        For Windows, use `npm run prod:win`. The output will be in the `dist` directory.

### Technologies Used

  * **Framework:** Expo React Native
  * **Desktop Application:** Electron.js (for converting the web build into a desktop app)
  * **OCR:** `react-native-mlkit-ocr`, `tesseract.js`
  * **Navigation:** `@react-navigation/native`, `expo-router`
  * **State Management:** `zustand`
  * **PDF Handling:** `pdf-lib`, `react-native-pdf`
  * **Image Manipulation:** `expo-image-manipulator`
  * **Other Libraries:** `firebase`, `lottie-react-native`, `expo-image`, `expo-sharing`, and more (see `package.json` for a full list).

-----

## 🤝 Contribution

Contributions are welcome\! If you have suggestions or find issues, please open an issue or submit a pull request.

-----
 
## 📞 Contact

For any inquiries, please reach out to **[Bima Saputra](mailto:sbima2432@gmail.com)**.
 
-----
