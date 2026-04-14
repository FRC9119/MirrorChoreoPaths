import fs from 'fs';

const FULL_FIELD_Y = 8.0693
const RELATIVE_DIR_PATH = "../Swerve-Code-Practice/src/main/deploy/choreo/"
fs.readdir(RELATIVE_DIR_PATH, (err, files) => {
    files.forEach((fileName) => {
        if(!(fileName.includes("Left") && fileName.includes(".traj"))) return
        fs.readFile(RELATIVE_DIR_PATH + 
            fileName, (err, data) => {
            let json = JSON.parse(data)
            json.params.waypoints.forEach((waypoint) => {
                const newY = FULL_FIELD_Y - waypoint.y.val
                const newHeading = -waypoint.heading.val
                
                waypoint.y = {exp: `${newY} m`, val:newY}
                waypoint.heading = {exp: `${newHeading} rad`, val:newHeading}

            })
            fs.writeFile(RELATIVE_DIR_PATH + fileName.replace("Left", "Right"), new Uint8Array(Buffer.from(JSON.stringify(json))), (err) => console.log(err))
        })
    })
})
