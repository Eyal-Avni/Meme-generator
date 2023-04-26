'use strict'

var gMemes = []

var gImgs = [
    { id: 1, url: 'imgs/1.jpg', keywords: ['politics'] },
    { id: 2, url: 'imgs/2.jpg', keywords: ['animals'] },
    { id: 3, url: 'imgs/3.jpg', keywords: ['animals', 'kids'] },
    { id: 4, url: 'imgs/4.jpg', keywords: ['animals'] },
    { id: 5, url: 'imgs/5.jpg', keywords: ['kids'] },
    { id: 6, url: 'imgs/6.jpg', keywords: ['TV'] },
    { id: 7, url: 'imgs/7.jpg', keywords: ['kids'] },
    { id: 8, url: 'imgs/8.jpg', keywords: ['movies'] },
]
var gMeme = {
    selectedImgId: 1,
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
}

var gCurrImgIdx
var gFillterBy = null

function getMeme() {
    return gMeme
}

function getImgURL(meme) {
    const img = gImgs.find((img) => img.id === meme.selectedImgId)
    return img.url
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getAllLines() {
    return gMeme.lines
}

function setLineTxt(txt) {
    const line = getCurrLine()
    if (!line) return
    line.txt = txt
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
    if (!gFillterBy) return gImgs
    return gImgs.filter((img) => img.keywords.includes(gFillterBy))
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
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [],
    }
}

//Private methods

function _createLine(numNewLine) {
    const newPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    if (numNewLine === 1) newPos.y = 50
    else if (numNewLine === 2) newPos.y = gElCanvas.height - 50
    return {
        txt: 'New line',
        size: 40,
        align: 'center',
        color: 'black',
        posX: newPos.x,
        posY: newPos.y,
    }
}
