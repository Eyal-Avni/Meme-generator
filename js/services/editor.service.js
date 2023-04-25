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
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            color: 'red',
        },
    ],
}

var gCurrImgIdx
var gCurrLineIdx = 0
var gFillterBy = null

function getMeme() {
    return gMeme
}

function getImgURL(meme) {
    const img = gImgs.find((img) => img.id === meme.selectedImgId)
    return img.url
}

function getLine() {
    return gMeme.lines[gCurrLineIdx]
}

function setLineTxt(txt) {
    const line = getLine()
    if (!line) return
    line.txt = txt
}

function _updateLineIdx(idx) {
    gCurrLineIdx = idx
    gMeme.selectedLineIdx = gCurrLineIdx
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
