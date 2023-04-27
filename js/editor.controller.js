'use strict'

var gElCanvas
var gCtx
var gCurrPos
var gDrag

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

function addListeners() {
    gElCanvas.addEventListener('mousemove', onDrag)
    gElCanvas.addEventListener('mousedown', onPress)
    gElCanvas.addEventListener('mouseup', onRelease)
    gElCanvas.addEventListener('touchmove', onDrag)
    gElCanvas.addEventListener('touchstart', onPress)
    gElCanvas.addEventListener('touchend', onRelease)
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
    const isLineClick = isLineClicked(pos)
    console.log(isLineClick)
    if (!isLineClick) return
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
    const currLine = getCurrLine()
    if (!currLine || !gDrag) return
    const pos = getEvPos(ev)
    if (currLine && gDrag) {
        moveXAxis(pos.x - gCurrPos.x)
        moveYAxis(pos.y - gCurrPos.y)
    }
    gElCanvas.style.cursor = 'grabbing'
    gCurrPos = pos
    renderMeme()
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
        currLine.posX - gCtx.measureText(currLine.txt).width / 2 - 10,
        currLine.posY - currLine.size + 5,
        gCtx.measureText(currLine.txt).width + 20,
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
