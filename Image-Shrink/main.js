const {app, BrowserWindow, Menu} = require('electron')
let mainWindow
let aboutWindow
process.env.NODE_ENV = 'development'
const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false
const isLinux = process.platform === 'linux' ? true : false


function createAboutWindow (){

    aboutWindow = new BrowserWindow({
        title: 'About',
        width: 300,
        height: 300,
        icon: __dirname+'/assets/icons/profileImage.png',
        resizable: false,
        backgroundColor:'white',
    })
    
    //mainWindow.loadURL('file://'+__dirname+'/app/index.html')
    aboutWindow.loadFile(__dirname+'/app/about.html')
}

function createMainWindow (){

    mainWindow = new BrowserWindow({
        title: 'Image Shrink',
        width: 500,
        height: 600,
        icon: __dirname+'/assets/icons/profileImage.png',
        resizable: isDev,
        backgroundColor:'white',
    })
    
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


