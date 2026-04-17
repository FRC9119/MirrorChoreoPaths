import fs from 'fs';

const FULL_FIELD_Y = 8.0693
const RELATIVE_DIR_PATH = "../Swerve-Code-Practice/src/main/deploy/choreo/"
const fileArray = fs.readdirSync(RELATIVE_DIR_PATH)
let index = 1
const filteredArray = fileArray.filter((fileName) => fileName.includes("Left") && fileName.includes(".traj"))
filteredArray.forEach((fileName) => {
    const data = fs.readFileSync(RELATIVE_DIR_PATH +
        fileName)
    let leftJson = JSON.parse(data)
    const rightFileName = fileName.replace("Left", "Right")
    const rightPath = RELATIVE_DIR_PATH + rightFileName
    leftJson.params.waypoints.forEach((waypoint) => {
        const newY = FULL_FIELD_Y - waypoint.y.val
        const newHeading = -waypoint.heading.val

        waypoint.y = { exp: `${newY} m`, val: newY }
        waypoint.heading = { exp: `${newHeading} rad`, val: newHeading }

    })
    const rightJson = JSON.parse(fs.readFileSync(rightPath))
    rightJson.params.waypoints = leftJson.params.waypoints
    fs.writeFile(rightPath, new Uint8Array(Buffer.from(JSON.stringify(rightJson))), () => { })
    console.log(`[${index}/${filteredArray.length}] Wrote waypoints from ${fileName} to ${rightFileName}`)
    index += 1

})
console.log("[IMPORTANT] You must close and reopen choreo, then generate all paths that were modified by this utility.")

