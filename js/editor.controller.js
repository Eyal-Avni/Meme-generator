'use strict'

var gElCanvas
var gCtx

function onInit() {
    loadMemesFromStorage()
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
    renderGallery()
    renderMemes()
    renderKeywordList()
    addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
    handleLineInputState()
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
        renderLineFocus()
        gCtx.save()
    }
}

function renderLines() {
    const lines = getAllLines()
    if (!lines) return
    lines.forEach((line) => {
        gCtx.textAlign = `${line.align}`
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = line.color
        gCtx.strokeStyle = line.stroke
        gCtx.fillText(line.txt, line.posX, line.posY)
        gCtx.strokeText(line.txt, line.posX, line.posY)
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

function onAlign(dir) {
    setLineAlign(dir)
    renderMeme()
}

function onMoveLine(dir) {
    setLinePos(dir)
    renderMeme()
}

function onSaveMeme() {
    const canvas = handleCanvasAspectRatioForSave()
    const canvasUrl = canvas.toDataURL()
    saveMeme(canvasUrl)
    renderMemes()
    alert('Meme saved')
}

function onDownloadMeme() {
    // renderMemeNoFocus()
    const canvasUrl = gElCanvas.toDataURL()
    const elA = document.createElement('a')
    elA.setAttribute('href', canvasUrl)
    elA.setAttribute('download', 'meme.png')
    document.body.appendChild(elA)
    elA.click()
    document.body.removeChild(elA)
}

function handleCanvasAspectRatioForSave() {
    let can = document.createElement('canvas')
    can.width = 215
    can.height = 215
    can.ctx = can.getContext('2d')
    can.ctx.drawImage(gElCanvas, 0, 0, can.width, can.height)
    return can
}

// function renderMemeNoFocus() {
//     const meme = getMeme()
//     const img = new Image()
//     img.src = getImgURL(meme)
//     if (!img.src) return
//     img.onload = () => {
//         resizeCanvas()
//         gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
//         renderLines()
//         gCtx.save()
//     }
// }

function updateLineInputTxt() {
    const currLine = getCurrLine()
    if (!currLine) return
    const elInput = document.querySelector('.input-line')
    elInput.value = `${currLine.txt}`
}

function handleLineInputState() {
    const lines = getAllLines()
    const elInput = document.querySelector('.input-line')
    if (!lines.length) {
        elInput.setAttribute('disabled', '')
        elInput.placeholder = 'Please add new line'
        elInput.value = ''
    } else {
        elInput.removeAttribute('disabled')
    }
}

function renderLineFocus() {
    const currLine = getCurrLine()
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

// function hideLineFocus() {
//     gCtx.beginPath()
//     gCtx.lineWidth = '0'
//     gCtx.strokeStyle = 'yellow'
//     gCtx.roundRect(Infinity, Infinity, 0, 0, 0)
//     gCtx.stroke()
//     renderMemeNoFocus()
// }

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
