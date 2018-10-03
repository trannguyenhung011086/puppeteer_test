import devices from 'puppeteer/DeviceDescriptors'

const emulatedDevices = {
    desktop: {
        name: 'Laptop 1280x800',
        viewport: {
            width: 1280,
            height: 800
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36'
    },
    mobile: devices['iPhone 6']
}

export default emulatedDevices