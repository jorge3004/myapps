import React from 'react'

const S3_BUCKET = "jir3d";
const REGION = "US East (N. Virginia) us-east-1";
const ACCESS_KEY = "REDACTED";
const SECRET_ACCESS_KEY = "REDACTED";


const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
};

export const Upload_S3 = () => {
    // const { action, fields } = data2;
    // const f = new FormData();
    // for (var key in fields) {
    //   f.append(key, fields[key]);
    // }
    // const file = event.target.files[0];
    // f.append("file", file, file.name);
    // const { data } = await axios.post(action, f);
    // var extension = file.name.match(/\.[0-9a-z]{1,5}$/i);

    // if (extension[0] === ".stl") {
    //
    // } else {
    //   alert("Solo archivo gcode aceptado");
    // }
    // };s
    return (
        <div>Upload_S3</div>
    )
}
