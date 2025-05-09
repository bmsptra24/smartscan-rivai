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
async function saveFileWithPathFromLocal(folderName, fileName, content) {
  try {
    // Validasi parameter
    if (typeof folderName !== 'string' || folderName.trim() === '') {
      console.error('folderName harus berupa string non-kosong:', folderName)
      return false
    }
    if (typeof fileName !== 'string' || fileName.trim() === '') {
      console.error('fileName harus berupa string non-kosong:', fileName)
      return false
    }

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
      console.error('Path folder tidak ditemukan di config')
      return false
    }

    // Gabungkan path folder dengan subdirektori Documents dan folderName
    const targetDir = path.join(folderPath, 'Documents', folderName)
    const filePath = path.join(targetDir, fileName)

    // Buat direktori jika belum ada
    try {
      await fs.mkdir(targetDir, { recursive: true })
      console.log('Direktori dibuat atau sudah ada:', targetDir)
    } catch (error) {
      console.error('Gagal membuat direktori:', error)
      return false
    }

    // Konversi content (ArrayBuffer) ke Buffer
    if (!(content instanceof ArrayBuffer)) {
      console.error(
        'Content harus berupa ArrayBuffer:',
        typeof content,
        content,
      )
      return false
    }
    const bufferContent = Buffer.from(content)

    // Simpan file ke lokasi yang ditentukan
    await fs.writeFile(filePath, bufferContent)
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

// Fungsi untuk mendapatkan daftar folder di dalam path yang tersimpan
async function getFolders() {
  try {
    // Ambil path folder dari file JSON
    let folderPath
    try {
      const configData = await fs.readFile(configPath, 'utf-8')
      const config = JSON.parse(configData)
      folderPath = config.folderPath
    } catch (error) {
      console.error('Gagal membaca config file:', error)
      throw error
    }

    if (!folderPath) {
      console.error('Path folder tidak ditemukan di local storage')
      throw new Error('Path folder tidak ditemukan')
    }

    const dirPath = path.resolve(folderPath)
    const items = await fs.readdir(dirPath, { withFileTypes: true })

    // Filter hanya folder dan ambil namanya
    const folders = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)

    return folders
  } catch (error) {
    console.error('Error reading folder:', error)
    throw error
  }
}

module.exports = {
  selectFolderAndSaveToLocal,
  saveFileWithPathFromLocal,
  openFileExplorer,
  getFolders,
}
