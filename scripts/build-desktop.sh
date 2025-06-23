#!/bin/bash

# Export variabel lingkungan dari .env
set -a
source .env
set +a

# Bersihkan folder dist dan web-build jika ada
if [ -d "dist" ]; then
  rm -rf dist
fi
if [ -d "web-build" ]; then
  rm -rf web-build
fi
if [ -d "electron/web-build" ]; then
  rm -rf electron/web-build
fi
if [ -d "electron/dist" ]; then
  rm -rf electron/dist
fi

# Export proyek Expo untuk web
npx expo export --platform web
if [ ! -d "dist" ]; then
  echo "Export gagal: folder dist tidak ditemukan"
  exit 1
fi

# Rename folder dist menjadi web-build
mv dist web-build
if [ $? -ne 0 ]; then
  echo "Gagal mengganti nama dist menjadi web-build"
  exit 1
fi

# Pindahkan web-build ke folder electron
mv web-build electron/
if [ $? -ne 0 ]; then
  echo "Gagal memindahkan web-build ke electron"
  exit 1
fi

# Masuk ke folder electron
cd electron || exit 1

# Jalankan build untuk Windows
npm run build
if [ $? -ne 0 ]; then
  echo "Build Electron gagal"
  exit 1
fi

# Copy folder dist ke direktori atas
cp -r dist ../
if [ $? -ne 0 ]; then
  echo "Gagal menyalin dist ke direktori atas"
  exit 1
fi

# Kembali ke direktori awal
cd ..