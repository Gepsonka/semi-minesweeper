var sweeperMap=[]

// creating 8x8 2 dimensonal array
// there will be two indicators: isBomb and numOfBombsAround
// these will decide which classes should I assign to each cell
for (let i=0; i<8;++i){
    let row=[]
    for (let j=0;j<8;++j){
        row.push({numOfBombsAround:0,isBomb:false,clicked:false})
    }
    sweeperMap.push(row)
}




// filling up the minefield randomly
var numberOfMines=8
while (numberOfMines!=0){
    i=Math.floor(Math.random() * 8)
    j=Math.floor(Math.random() * 8)
    console.log(i,j)
    if (sweeperMap[i][j].isBomb){
        continue
    } else {
        sweeperMap[i][j].isBomb=true
        numberOfMines-=1
    }
}

// calculating that how many bombs are around each cell
var helpList=[[-1,-1],[-1,0],[-1,1],
                [0,-1],[0,1],
                [1,-1],[1,0],[1,1]]
for (let i=0;i<8;++i){
    for (let j=0;j<8;++j){
        var numOfBombsAroundEach=0
        for (let z=0;z<helpList.length;++z){
            try{ // i do not want to deal with index erros specifically
                if (sweeperMap[i+helpList[z][0]][j+helpList[z][1]].isBomb){
                    numOfBombsAroundEach+=1
                }
            }catch(error){
                continue
            }
        }
        sweeperMap[i][j].numOfBombsAround=numOfBombsAroundEach
    }
    
}
console.log(sweeperMap)

const boxContainer=document.getElementById('box-container')
for(let i=0;i<8;++i){
    let row=document.createElement('div')
    row.classList.add('row')
    for (let x=0;x<8;++x){
        let cell=document.createElement('div')
        cell.classList.add('basic-box')
        cell.classList.add('sample-box')
        row.appendChild(cell)
    }
    boxContainer.appendChild(row)
}
