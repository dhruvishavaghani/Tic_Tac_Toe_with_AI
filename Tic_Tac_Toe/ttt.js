var origboard;
const huplayer="O";
const aiplayer="X";
const wincombos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];
let m=document.getElementById("h")
const cell=document.querySelectorAll(".cell")
startgame()

function startgame(){
   document.querySelector(".endgame").style.display="none"
   origboard=Array.from(Array(9).keys())
   for(var i=0;i<cell.length;i++){
    cell[i].innerText='';
    cell[i].style.removeProperty('background-color')
    cell[i].addEventListener("click",turnClick,false)
   }
}

function turnClick(square){
   if (typeof origboard[square.target.id]=='number'){
      turn(square.target.id,huplayer)
      if(!checktie()) turn(bestSpot(),aiplayer)
   }
}

function turn(squareId,player){
      origboard[squareId]=player;
      document.getElementById(squareId).innerText=player;
      let gamewon=checkwin(origboard,player)
      
      if(gamewon){
      gameover(gamewon)}
}

function checkwin(board,player){
      let plays=board.reduce((a,e,i)=>(e===player)? a.concat(i):a,[])
      let gamewon=null;
      for(let [index,win] of wincombos.entries()){
         if(win.every(elem=>plays.indexOf(elem)>-1))
         {
            gamewon={index:index, player:player}
            break
         }
      }
  return gamewon;
}

function gameover(gamewon){
   for(let index of wincombos[gamewon.index]){
      document.getElementById(index).style.backgroundColor=
      gamewon.player==huplayer? "blue" : "red";
   }
   for(var i=0;i<cell.length;i++){
      cell[i].removeEventListener("click",turnClick,false)
   }
   declarewinner(gamewon.player==huplayer? "You Win!!" : "You Lose ")
}

function declarewinner(winner){
  
   document.querySelector(".endgame").style.display="block"
   // document.querySelector(".endgame.text").textContent=winner
   // m.innerText="inside turn"
}

function emptysquares(){
   return origboard.filter(s=> typeof s=='number');
}

function bestSpot(){
   return minmax(origboard,aiplayer).index
}

function checktie(){
   if(emptysquares().length==0){
      for(var i=0;i<cell.length;i++)
      {
         cell[i].style.backgroundColor="green"
         cell[i].removeEventListener('click',turnClick,false)
      }
      declarewinner("Tie Game!")
      return true
   }
   return false
}

function minmax(newboard,player){
   var availspots=emptysquares(newboard)

   if(checkwin(newboard,player)){
      return  {score: -10}
   }
   else if(checkwin(newboard,aiplayer)){
      return{score:20}
   }
   else if(availspots.length===0){
      return {score:0}
   }
   var moves=[]
   for(var i=0;i<availspots.length;i++)
   {
      var move={}
      move.index=newboard[availspots[i]]
      newboard[availspots[i]]=player

      if(player==aiplayer){
         var result=minmax(newboard,huplayer)
         move.score=result.score
      }
      else{
         var result=minmax(newboard,aiplayer)
         move.score=result.score
      }
      newboard[availspots[i]]=move.index

      moves.push(move)
   }
   var bestmove
   if(player===aiplayer){
      var bestscore=-10000
      for(var i=0;i<moves.length;i++)
      {
         if(moves[i].score>bestscore){
            bestscore=moves[i].score
            bestmove=i;
         }
      }
   }
   else{
      var bestscore=10000
      for(var i=0;i<moves.length;i++){
        if(moves[i].score<bestscore){
         bestscore=moves[i].score
         bestmove=i;
        }
      }
   }
   return moves[bestmove]
}