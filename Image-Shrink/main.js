const path = require('path')
const os = require('os')
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')
const log = require('electron-log')
let mainWindow
let aboutWindow
process.env.NODE_ENV = 'production'
const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false
const isLinux = process.platform === 'linux' ? true : false


function createAboutWindow (){

    aboutWindow = new BrowserWindow({
        title: 'About',
        width: 300,
        height: 300,
        icon: path.join(__dirname,'/assets/icons/64x64.png'),
        resizable: false,
        backgroundColor:'white',
    })
    
    //mainWindow.loadURL('file://'+__dirname+'/app/index.html')
    aboutWindow.loadFile(__dirname+'/app/about.html')
}

function createMainWindow (){

    mainWindow = new BrowserWindow({
        title: 'Image Shrink',
        width: isDev ? 900 : 500,
        height: 600,
        icon: __dirname+'./assets/icons/profileImage.png',
        resizable: isDev,
        backgroundColor:'white',
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    if(isDev){
        mainWindow.webContents.openDevTools()
    }
    //mainWindow.loadURL('file://'+__dirname+'/app/index.html')
    mainWindow.loadFile(__dirname+'/app/index.html')
}


app.on('ready', () => {
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', () => mainWindow = null)
})
const menu = [
     ...(isMac ? [
         { 
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow,
                }
            ]
         }
     ] : []),

    {
        role:'FileMenu'
    },
    ...(!isMac ? [
        { 
           label: 'Help',
           submenu: [
               {
                   label: 'About',
                   click: createAboutWindow,
               }
           ]
        }
    ] : []),
    

    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {type: 'separator'},
                {role: 'toggledevtools'}
            ]
        }
    ]: []),

    
]



ipcMain.on('image:minimize', (e, options) =>{
   options.dest = path.join(os.homedir(), 'imageshrink')
   shrinkImage(options)
//    console.log(options)
})

async function shrinkImage({ imgPath, quality, dest}){
    try{
        const pngQuality = quality/100
        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [
                imageminMozjpeg({quality}),
                imageminPngquant({
                    quality: [pngQuality, pngQuality]
                })
            ]
        })

        console.log(files)
        log.info(files)
        shell.openPath(dest)


        mainWindow.webContents.send('image:done')


    }catch(err){
        console.log(err)
        log.error(err)
    }
}
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })


