'use strict'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
    renderGallery()
    addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function renderMeme() {
    const meme = getMeme()
    const img = new Image()
    img.src = getImgURL(meme)
    if (!img.src) return
    img.onload = () => {
        resizeCanvas()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLines()
        gCtx.save()
    }
}

function renderLines() {
    const lines = getAllLines()
    if (!lines) return
    lines.forEach((line) => {
        // const txt = line.txt
        // gCtx.lineWidth = 2
        // gCtx.textBaseline = 'top'
        gCtx.textAlign = `${line.align}`
        // document.fonts.ready.then(() => {
        gCtx.font = `${line.size}px sans-serif`
        gCtx.fillStyle = line.color
        // gCtx.strokeStyle = line.stroke
        gCtx.fillText(line.txt, line.posX, line.posY)
        // gCtx.strokeText(txt, line.pos.x, line.pos.y)

        // const selectedLine = getCurrLine()
        // if (line === selectedLine && !gIsMemeSave) {
        //     drawBorder()
        // }
        // })
    })
}

function onChangeLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onFontUp() {
    increaseFontSize()
    renderMeme()
}

function onFontDown() {
    decreaseFontSize()
    renderMeme()
}

function onChangeTxtColor(ev) {
    setLineColor(ev.target.value)
    renderMeme()
}

function onMoveBetweenLines() {
    moveSelectedLine()
}

function onNewLine() {
    addLine()
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
}
