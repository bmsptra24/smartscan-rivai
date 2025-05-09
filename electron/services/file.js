const { dialog, app, shell } = require('electron')
const fs = require('fs').promises
const path = require('path')

// Lokasi file konfigurasi untuk menyimpan path folder
const configPath = path.join(app.getPath('userData'), 'config.json')

// Fungsi untuk memilih folder dan menyimpan path ke file JSON
async function selectFolderAndSaveToLocal() {
  try {
    // Membuka dialog untuk memilih folder
    const result = await dialog.showOpenDialog({
      title: 'Pilih Lokasi Folder Dokumen',
      properties: ['openDirectory'], // Hanya memilih folder
    })

    if (result.canceled) {
      console.log('Pemilihan folder dibatalkan')
      return null
    }

    const folderPath = result.filePaths[0] // Ambil path folder yang dipilih

    // Simpan path ke file JSON
    const config = { folderPath }
    await fs.writeFile(configPath, JSON.stringify(config, null, 2))
    console.log('Path berhasil disimpan ke local storage:', folderPath)
    return folderPath
  } catch (error) {
    console.error(
      'Error saat memilih folder atau menyimpan ke local storage:',
      error,
    )
    return null
  }
}

// Fungsi untuk menyimpan file menggunakan path dari file JSON
async function saveFileWithPathFromLocal(fileName, content) {
  try {
    // Ambil path folder dari file JSON
    let folderPath
    try {
      const configData = await fs.readFile(configPath, 'utf-8')
      const config = JSON.parse(configData)
      folderPath = config.folderPath
    } catch (error) {
      console.error('Gagal membaca config file:', error)
      return false
    }

    if (!folderPath) {
      console.error('Path folder tidak ditemukan di local storage')
      return false
    }

    // Gabungkan path folder dengan nama file menggunakan path.join untuk cross-platform
    const filePath = path.join(folderPath, fileName)

    // Simpan file ke lokasi yang ditentukan
    await fs.writeFile(filePath, content)
    console.log('File berhasil disimpan di:', filePath)
    return true
  } catch (error) {
    console.error('Error saat mengambil path atau menyimpan file:', error)
    return false
  }
}

// Fungsi untuk membuka file explorer di path yang tersimpan
async function openFileExplorer() {
  try {
    // Ambil path folder dari file JSON
    let folderPath
    try {
      const configData = await fs.readFile(configPath, 'utf-8')
      const config = JSON.parse(configData)
      folderPath = config.folderPath
    } catch (error) {
      console.error('Gagal membaca config file:', error)
      return false
    }

    if (!folderPath) {
      console.error('Path folder tidak ditemukan di local storage')
      return false
    }

    // Buka file explorer di path yang ditentukan
    await shell.openPath(folderPath)
    console.log('File explorer dibuka di:', folderPath)
    return true
  } catch (error) {
    console.error('Error saat membuka file explorer:', error)
    return false
  }
}

module.exports = {
  selectFolderAndSaveToLocal,
  saveFileWithPathFromLocal,
  openFileExplorer,
}
