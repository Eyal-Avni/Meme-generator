'use strict'

var gElCanvas
var gCtx
var gCurrPos
var gDrag
var gSelectedType

function renderMeme() {
    const meme = getMeme()
    const img = new Image()
    img.src = getImgURL(meme)
    if (!img.src) return
    img.onload = () => {
        resizeCanvas()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLines()
        renderObjFocus()
        renderMemeStickers()
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

function renderMemeStickers() {
    const stickers = getAllStickers()
    if (!stickers) return
    stickers.forEach((sticker) => {
        const img = new Image()
        img.src = sticker.url
        gCtx.drawImage(img, sticker.posX, sticker.posY, 50, 50)
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

function onAddSticker(elSticker) {
    const url = elSticker.getAttribute('src')
    addSticker(url)
    renderMeme()
}

function onDeleteOjb() {
    deleteObj(gSelectedType)
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

async function onShareMeme() {
    const canvasUrl = gElCanvas.toDataURL()
    const blob = await (await fetch(canvasUrl)).blob()
    const file = new File([blob], 'meme.png', { type: blob.type })
    navigator.share({
        title: 'My meme',
        text: 'Check out this meme!',
        files: [file],
    })
}

function onPress(ev) {
    gDrag = true
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) {
        if (!isStickerClicked(pos)) {
            return
        } else gSelectedType = 'sticker'
    } else gSelectedType = 'line'
    updateLineInputTxt()
    renderMeme()
    gCurrPos = pos
    gElCanvas.style.cursor = 'grab'
}

function onRelease() {
    gDrag = false
    gElCanvas.style.cursor = 'grab'
}

function onDrag(ev) {
    let currObj
    if (gSelectedType === 'line') {
        currObj = getCurrLine()
    } else if (gSelectedType === 'sticker') {
        currObj = getCurrSticker()
    }
    if (!currObj || !gDrag) return
    const pos = getEvPos(ev)
    if (currObj && gDrag) {
        moveXAxis(pos.x - gCurrPos.x, gSelectedType)
        moveYAxis(pos.y - gCurrPos.y, gSelectedType)
    }
    gElCanvas.style.cursor = 'grabbing'
    gCurrPos = pos
    renderMeme()
}

function onStickerPage(dir) {
    moveStickersSubArr(dir)
    renderStickers()
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

function renderObjFocus() {
    let currObj
    if (gSelectedType === 'line') {
        currObj = getCurrLine()
    } else if (gSelectedType === 'sticker') {
        currObj = getCurrSticker()
    }
    if (!currObj) return
    gCtx.beginPath()
    gCtx.lineWidth = '1'
    gCtx.setLineDash([20, 3, 3, 3, 3, 3, 3, 3])
    gCtx.strokeStyle = 'black'
    if (gSelectedType === 'line') {
        gCtx.roundRect(
            currObj.posX - gCtx.measureText(currObj.txt).width / 2 - 10,
            currObj.posY - currObj.size + 5,
            gCtx.measureText(currObj.txt).width + 20,
            currObj.size + 2,
            15
        )
    } else if (gSelectedType === 'sticker') {
        gCtx.roundRect(currObj.posX, currObj.posY, 50, 50, 15)
    }
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
    // gElCanvas.height = elContainer.offsetHeight
    // elContainer.width = (gElCanvas.height * img.height) / img.width
    // elContainer.height = (img.height * gElCanvas.width) / img.width
    // gElCanvas.width = (gElCanvas.height * img.height) / img.width
    // gElCanvas.height = (img.height * gElCanvas.width) / img.width
}

function buildCurrImg() {
    const imgURL = getImgURL(getMeme())
    const img = new Image()
    img.src = imgURL
    return img
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
