'use strict'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function makeId(length = 4) {
    var id = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        id += possible.charAt(getRandomIntInclusive(0, possible.length))
    }
    return id
}

function makeRandLine() {
    let randStr = ''
    const strSize = getRandomIntInclusive(1, 4)
    const words = [
        'chair',
        'book',
        'shoe',
        'guitar',
        'television',
        'lamp',
        'keyboard',
        'camera',
        'phone',
        'backpack',
        'umbrella',
        'wallet',
        'glasses',
        'watch',
        'headphones',
    ]
    for (let i = 0; i < strSize; i++) {
        const randIdx = getRandomIntInclusive(0, words.length - 1)
        randStr += words[randIdx] + ' '
    }
    return randStr
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getEvPos(ev) {
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop,
        }
    }
    return pos
}
