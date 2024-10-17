module.exports = {
    skipFiles: [
        'mock',
        'interface',
        'test',
        'lib'
    ],
    modifierWhitelist: [
        'onlyInitializing',
        'initializer',
        'nonReentrant',
        'whenNotPaused'
    ]
};