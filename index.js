var sweeperMap=[]
var numberOfMines=8
var flagsUsed=0
const boxContainer = document.getElementById('box-container')
const endOfGameLose = document.getElementById('end-of-game-lose')
const endOfGameWin = document.getElementById('end-of-game-win')
const newGameLoseBtn=document.getElementById('new-game-btn-lose')
newGameLoseBtn.addEventListener('click',()=>{
    endOfGameLose.classList.add('no-display')
    initGame()
})
const newGameWinBtn=document.getElementById('new-game-btn-win')
newGameWinBtn.addEventListener('click',()=>{
    endOfGameWin.classList.add('no-display')
    initGame()
})
const flagCounter=document.getElementById('flag-counter')
flagCounter.innerHTML=`Flags:${numberOfMines}`


function initGame(){
    sweeperMap=[]
    flagsUsed=0
    flagCounter.innerHTML=`Flags:${numberOfMines}`
    boxContainer.textContent=''
    initMap()
    fillUpMinefield()
    calcBombAround()
    renderMinefield()
}

function initMap(){
    // creating 8x8 2 dimensional array
    // there will be some indicators: isBomb, numOfBombsAround,clicked and isFlagged
    // these will decide which classes should I assign to each cell
    for (let i=0; i<8;++i){
        let row=[]
        for (let j=0;j<8;++j){
            row.push({numOfBombsAround:0,isBomb:false,clicked:false,isFlagged:false})
        }
        sweeperMap.push(row)
    }
}



function fillUpMinefield(){
    // filling up the minefield randomly
    let numOfmines=numberOfMines
    while (numOfmines!=0){
        i=Math.floor(Math.random() * 8)
        j=Math.floor(Math.random() * 8)
        //console.log(i,j)
        if (sweeperMap[i][j].isBomb){
            continue
        } else {
            sweeperMap[i][j].isBomb=true
            numOfmines-=1
        }
    }
}


function calcBombAround(){
    // calculating that how many bombs are around each cell
    var helpList = [[-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]]
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            var numOfBombsAroundEach = 0
            for (let z = 0; z < helpList.length; ++z) {
                try { // i do not want to deal with index erros specifically
                    if (sweeperMap[i + helpList[z][0]][j + helpList[z][1]].isBomb) {
                        numOfBombsAroundEach += 1
                    }
                } catch (error) {
                    continue
                }
            }
            sweeperMap[i][j].numOfBombsAround = numOfBombsAroundEach
        }

    }
}





function renderMinefield(){
    for (let i = 0; i < 8; ++i) {
        let row = document.createElement('div')
        row.classList.add('row')
        for (let x = 0; x < 8; ++x) {
            let cell = document.createElement('div')
            cell.classList.add('basic-box')
            cell.classList.add('sample-box')
            cell.addEventListener('click',function (){
                cellClicked(i,x)
            })
            cell.addEventListener('contextmenu',function(e){
                e.preventDefault()
                placeFlag(i,x)
            })
            row.appendChild(cell)
        }
        boxContainer.appendChild(row)
    }
}



function revealAllBombs(){
    for (let y=0;y<8;++y){
        for (let x=0;x<8;++x){
            if (sweeperMap[y][x].isBomb){
                let cell=boxContainer.childNodes[y].childNodes[x]
                cell.classList.remove('bomb')
                cell.classList.add('bomb-exploded')
            }
        }
    }
}

function Lose(){
    endOfGameLose.classList.remove('no-display')
}

function Win(){
    endOfGameWin.classList.remove('no-display')
}

function cellClicked(y,x){
    if (sweeperMap[y][x].isFlagged){
        return false
    }
    let cell=boxContainer.childNodes[y].childNodes[x]
    //console.log(boxContainer.childNodes)
    if (sweeperMap[y][x].isBomb){
        revealAllBombs()
        cell.classList.remove('bomb-exploded')
        cell.classList.add('bomb')
        Lose()
    } 
    else if (sweeperMap[y][x].numOfBombsAround==0){
        let newCell=cell.cloneNode(true)
        cell.parentNode.replaceChild(newCell,cell) //removing all event listeners
        newCell.classList.remove('sample-box')
        newCell.classList.add('empty-field')
    } else {
        let newCell=cell.cloneNode(true)
        cell.parentNode.replaceChild(newCell,cell) //removing all event listeners
        newCell.classList.remove('sample-box')
        newCell.classList.add(`bomb-${sweeperMap[y][x].numOfBombsAround}`)
    }
    sweeperMap[y][x].clicked=true
}

function placeFlag(y,x){
    if (sweeperMap[y][x].clicked){ // prevent the ability to add flags to already discovered cells
        return false
    }
    if (!sweeperMap[y][x].isFlagged && flagsUsed!=numberOfMines){
        sweeperMap[y][x].isFlagged=true
        let cell=boxContainer.childNodes[y].childNodes[x]
        cell.className=''
        cell.classList.add('basic-box')
        cell.classList.add('flag')
        flagsUsed+=1
        let win=true
        for (let i=0;i<8;++i){
            for (let j=0;j<8;++j){
                if (sweeperMap[i][j].isBomb && !sweeperMap[i][j].isFlagged){
                    win=false
                }
            }
        } 
        flagCounter.innerHTML=`Flags:${numberOfMines-flagsUsed}`
        if (win){
            Win()
        } else  {
            return false
        }
    } else if (sweeperMap[y][x].isFlagged) {
        sweeperMap[y][x].isFlagged=false
        let cell=boxContainer.childNodes[y].childNodes[x]
        cell.className=''
        cell.classList.add('basic-box')
        cell.classList.add('sample-box')
        flagsUsed-=1
        flagCounter.innerHTML=`Flags:${numberOfMines-flagsUsed}`
    }
}



initGame()