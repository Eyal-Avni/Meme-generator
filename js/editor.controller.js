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
    handleLineInputState()
}

function renderMeme() {
    const currLine = getCurrLine()
    const meme = getMeme()
    const img = new Image()
    img.src = getImgURL(meme)
    if (!img.src) return
    img.onload = () => {
        resizeCanvas()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLines()
        renderLineFocus(currLine)
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

        gCtx.font = `${line.size}px ${line.font}`
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
    handleLineInputState()
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
    updateLineInputTxt()
    renderMeme()
}

function onNewLine() {
    addLine()
    handleLineInputState()
    updateLineInputTxt()
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    handleLineInputState()
    renderMeme()
}

function onSelectFont(font) {
    loadFont(font)
}

function updateLineInputTxt() {
    const currLine = getCurrLine()
    const elInput = document.querySelector('.input-line')
    elInput.value = `${currLine.txt}`
}

function handleLineInputState() {
    const lines = getAllLines()
    const elInput = document.querySelector('.input-line')
    if (!lines.length) {
        elInput.setAttribute('disabled', '')
        elInput.placeholder = 'Please create new line'
        elInput.value = ''
    } else {
        elInput.removeAttribute('disabled')
    }
}

function renderLineFocus(currLine) {
    if (!currLine) return
    gCtx.beginPath()
    gCtx.lineWidth = '3'
    gCtx.strokeStyle = 'yellow'
    gCtx.roundRect(
        (currLine.posX / 2 - currLine.txt.length * currLine.size * 0.15) * 2,
        currLine.posY - currLine.size + 5,
        currLine.txt.length * currLine.size * 0.6,
        currLine.size + 2,
        15
    )
    gCtx.stroke()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
}

function loadFont(font) {
    if (font === 'impact') {
        setLineFont(font)
        renderMeme()
    } else {
        const currFont = new FontFace(`${font}`, `url(fonts/${font}.ttf`)
        currFont.load().then((font) => {
            setLineFont(font.family)
            renderMeme()
        })
    }
}
