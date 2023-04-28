'use strict'

const MEMES_KEY = 'memesDB'
const IMGS_KEY = 'imgsDB'

var gStickers = [
    'stickers/1.svg',
    'stickers/2.svg',
    'stickers/3.svg',
    'stickers/4.svg',
    'stickers/5.svg',
    'stickers/6.svg',
    'stickers/7.svg',
    'stickers/8.svg',
    'stickers/9.svg',
]

var gSubStickers = [gStickers[0], gStickers[1], gStickers[2]]
var gSubStickersHead = gSubStickers.length - 1
var gSubStickersTail = 0

var gMemes = []

var gImgs
var gMeme = {
    id: makeId(),
    selectedImgId: '1',
    selectedLineIdx: 0,
    lines: [
        // {
        //     txt: '',
        //     size: 40,
        //     align: 'center',
        //     color: 'white',
        //     posX: 200,
        //     posY: 50,
        // },
        // {
        //     txt: 'sdfsfsd',
        //     size: 40,
        //     align: 'center',
        //     color: 'green',
        //     posX: 250,
        //     posY: 250,
        // },
    ],
    selectedStickerIdx: 0,
    stickers: [
        {
            url: 'stickers/1.svg',
            posX: 200,
            posY: 200,
        },
    ],
}

var gFillterKeyword = null

function getMeme() {
    return gMeme
}

function getStickersSubArr() {
    return gSubStickers
}

function moveStickersSubArr(dir) {
    if (dir === 'prev') {
        gSubStickersHead--
        gSubStickersTail--
        gSubStickers[2] = gSubStickers[1]
        gSubStickers[1] = gSubStickers[0]
        if (gSubStickersTail === -1) {
            gSubStickersTail = gStickers.length - 1
            gSubStickers[0] = gStickers[gSubStickersTail]
        } else gSubStickers[0] = gStickers[gSubStickersTail]
        if (gSubStickersHead === -1) {
            gSubStickersHead = gStickers.length - 1
        }
    } else if (dir === 'next') {
        gSubStickersHead++
        gSubStickersTail++
        gSubStickers[0] = gSubStickers[1]
        gSubStickers[1] = gSubStickers[2]
        if (gSubStickersHead === gStickers.length) {
            gSubStickersHead = 0
            gSubStickers[2] = gStickers[gSubStickersHead]
        } else gSubStickers[2] = gStickers[gSubStickersHead]
        if (gSubStickersTail === gStickers.length) {
            gSubStickersTail = 0
        }
    }
}

function addSticker() {}

function getMemes() {
    return gMemes
}

function getImgURL(meme) {
    const img = gImgs.find((img) => img.id === meme.selectedImgId)
    return img.url
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getCurrSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx]
}

function getAllLines() {
    return gMeme.lines
}

function getAllStickers() {
    return gMeme.stickers
}

function setLineTxt(txt) {
    const line = getCurrLine()
    if (!line) return
    line.txt = txt
}

function setMemeId() {
    gMeme.id = makeId()
}

function setLinePos(dir) {
    const line = getCurrLine()
    if (!line) return
    switch (dir) {
        case 'up':
            if (line.posY > 10) line.posY -= 10
            break
        case 'down':
            if (line.posY < gElCanvas.height - 10) line.posY += 10
            break
        case 'left':
            if (line.posX > 10) line.posX -= 10
            break
        case 'right':
            if (line.posX < gElCanvas.width - 10) line.posX += 10
            break
        default:
            break
    }
}

function increaseFontSize() {
    const line = getCurrLine()
    if (!line) return
    line.size += 3
}

function decreaseFontSize() {
    const line = getCurrLine()
    if (!line || line.size <= 4) return
    line.size -= 3
}

function setLineColor(color) {
    const line = getCurrLine()
    if (!line) return
    line.color = color
}

function setLineFont(font) {
    const line = getCurrLine()
    if (!line) return
    line.font = font
}

function setLineAlign(dir) {
    const line = getCurrLine()
    if (!line) return
    line.align = dir
    switch (dir) {
        case 'left':
            line.posX = 0
            break
        case 'right':
            line.posX = gElCanvas.width
            break
        case 'center':
            line.posX = gElCanvas.width / 2
            break
        default:
            break
    }
}

function addLine() {
    const numNewLine = gMeme.lines.length + 1
    const newLine = _createLine(numNewLine)
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (!gMeme.selectedLineIdx) return
    else gMeme.selectedLineIdx--
}

function getImgs() {
    if (!gFillterKeyword) return gImgs
    return gImgs.filter((img) => img.keywords.includes(gFillterKeyword))
}

function prepUploadedImg(src) {
    setMemeId()
    const id = makeId()
    gImgs.unshift({ id: id, url: src, keywords: [] })
    _saveImgsToStorage()
    // gMeme.selectedImgId = id
}

function getKeywordsList() {
    const uniqueKeywords = []
    gImgs.forEach((img) => {
        img.keywords.forEach((keyword) => {
            if (!uniqueKeywords.includes(keyword)) {
                uniqueKeywords.push(keyword)
            }
        })
    })
    return uniqueKeywords
}

function getKeywordMap() {
    const keywordMap = gImgs.reduce((acc, img) => {
        img.keywords.forEach((keyword) => {
            if (acc[keyword]) {
                acc[keyword]++
            } else {
                acc[keyword] = 1
            }
        })
        return acc
    }, {})
    return keywordMap
}

function findImgByIdx(id) {
    return gImgs.find((img) => img.id === id)
}

function setSelectedImgId(img) {
    gMeme.selectedImgId = img.id
}

function moveSelectedLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function resetMeme() {
    gMeme = {
        selectedImgId: '1',
        selectedLineIdx: 0,
        lines: [],
    }
}
function makeRandomMeme() {
    resetMeme()
    gMeme.selectedImgId = gImgs[getRandomIntInclusive(0, gImgs.length - 1)].id
    const numOfLines = getRandomIntInclusive(1, 2)
    gMeme.selectedLineIdx = numOfLines - 1
    setMemeId()
    for (let i = 0; i < numOfLines; i++) {
        const txt = makeRandLine()
        const size = getRandomIntInclusive(5, 60)
        const color = getRandomColor()
        const stroke = getRandomColor()
        const newLine = _createLine(i, txt, size, color, stroke)
        gMeme.lines.push(newLine)
    }
}

function saveMeme(canvasUrl) {
    const memeId = gMemes.findIndex((meme) => {
        return meme.memeObj.id === gMeme.id
    })
    if (memeId === -1) {
        gMemes.push({ memeObj: gMeme, memeImg: canvasUrl })
    } else {
        gMemes.splice(memeId, 1, { memeObj: gMeme, memeImg: canvasUrl })
    }
    _saveMemesToStorage()
}

function setCurrMemeById(id) {
    const meme = gMemes.find((meme) => meme.memeObj.id === id)
    gMeme = meme.memeObj
}

function setFilterKeyword(keyword) {
    gFillterKeyword = keyword
}

function isLineClicked(clickedPos) {
    const lines = getAllLines()
    const clickedLineIdx = lines.findIndex((line) => {
        const lineWidth = gCtx.measureText(line.txt).width
        return (
            clickedPos.x >= line.posX - lineWidth / 2 - 20 &&
            clickedPos.x <= line.posX + lineWidth / 2 + 20 &&
            clickedPos.y >= line.posY - line.size - 10 &&
            clickedPos.y <= line.posY + line.size
        )
    })
    if (clickedLineIdx !== -1) {
        gMeme.selectedLineIdx = clickedLineIdx
        return true
    }
    return false
}

function isStickerClicked(clickedPos) {
    const stickers = getAllStickers()
    const clickedStickerIdx = stickers.findIndex((sticker) => {
        return (
            clickedPos.x >= sticker.posX - 40 &&
            clickedPos.x <= sticker.posX + 40 &&
            clickedPos.y >= sticker.posY - 40 &&
            clickedPos.y <= sticker.posY + 40
        )
    })
    if (clickedStickerIdx !== -1) {
        gMeme.selectedStickerIdx = clickedStickerIdx
        return true
    }
    return false
}

function moveXAxis(distance, type) {
    let obj
    if (type === 'line') {
        obj = getCurrLine()
    } else if (type === 'sticker') {
        obj = getCurrSticker()
    }
    if (obj.posX > gElCanvas.width - 10) {
        obj.posX = gElCanvas.width - 10
        return
    }
    if (obj.posX < 10) {
        obj.posX = 10
        return
    }
    obj.posX += distance
}

function moveYAxis(distance, type) {
    let obj
    if (type === 'line') {
        obj = getCurrLine()
    } else if (type === 'sticker') {
        obj = getCurrSticker()
    }
    if (obj.posY > gElCanvas.height - 10) {
        obj.posY = gElCanvas.height - 10
        return
    }
    if (obj.posY < 10) {
        obj.posY = 10
        return
    }
    obj.posY += distance
}

function _createLine(
    numNewLine,
    txt = 'New line',
    size = 40,
    color = 'black',
    stroke = 'white'
) {
    const newPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    if (numNewLine === 1) newPos.y = 50
    else if (numNewLine === 2) newPos.y = gElCanvas.height - 50
    return {
        font: 'impact',
        txt,
        size,
        align: 'center',
        color,
        posX: newPos.x,
        posY: newPos.y,
        stroke,
    }
}

function _saveMemesToStorage() {
    saveToStorage(MEMES_KEY, gMemes)
}

function loadMemesFromStorage() {
    gMemes = loadFromStorage(MEMES_KEY)
    if (!gMemes) gMemes = []
}

function _saveImgsToStorage() {
    saveToStorage(IMGS_KEY, gImgs)
}

function loadImgsFromStorage() {
    gImgs = loadFromStorage(IMGS_KEY)
    if (!gImgs)
        gImgs = [
            { id: '1', url: 'imgs/1.jpg', keywords: ['politics'] },
            { id: '2', url: 'imgs/2.jpg', keywords: ['animals'] },
            { id: '3', url: 'imgs/3.jpg', keywords: ['animals', 'kids'] },
            { id: '4', url: 'imgs/4.jpg', keywords: ['animals'] },
            { id: '5', url: 'imgs/5.jpg', keywords: ['kids'] },
            { id: '6', url: 'imgs/6.jpg', keywords: ['TV'] },
            { id: '7', url: 'imgs/7.jpg', keywords: ['kids'] },
            { id: '8', url: 'imgs/8.jpg', keywords: ['movies'] },
            { id: '9', url: 'imgs/9.png', keywords: ['movies'] },
        ]
}
