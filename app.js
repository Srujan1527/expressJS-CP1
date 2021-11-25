const express = require("express");

const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const covertDbIntoResponse=(dbObject)=>{
    return {
        playerId:dbObject.player_Id,
        playerName:dbObject.player_name,
        jerseyNumber:dbObject.jerseyNumber,
        role:dbObject.role
    }
}
//API 1
app.get("/players/", async (request, response) => {
  const getAllPlayers = `SELECT * FROM cricket_team`;
  const allPlayers = await db.all(getAllPlayers);
  response.send(allPlayers.map((eachPlayer)=>
      covertDbIntoResponse(eachPlayer)
  );
)
});
//API 2
app.post("/players/",async(request,response)=>{
    const {playerName,jerseyNumber,role}=request.body
    const postPlayerQuery=`
        INSERT INTO cricket_team (playerName,jerseyNumber,role)
        VALUES ('${playerName}',${jerseyNumber},'${role}')`;
    const player = await db.run(postPlayerQuery)
    response,send("Player Added to Team")

//API 3
app.get("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params
    const getPlayerQuery=`SELECT * FROM cricket_team
        WHERE player_id=${playerId}`
    const player= await db.get(getPlayerQuery)
    response.send(covertDbIntoResponse(player))

//API 4
app.put("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const {playerName,jerseyNumber,role}=request.body
    const updatePlayerQuery=`
    UPDATE cricket_team 
    SET 
        player_name='${playerName}',
        jersey_number='${jerseyNumber}',
        role=${role}
    WHERE player_id=${playerId}`
    await db.run(updatePlayerQuery)
    response.send ("Player Details Updated")
})
//API 5 
app.delete("/players/:playersId/",async(request,response)=>{
    const {playerId}=request.params;
    const deletePlayerQuery=`
    DELETE FROM cricket_team
    where player_id=${playerId}`
    await db.run(deletePlayerQuery)
    response.send("Player Removed")
})

module.exports=app
