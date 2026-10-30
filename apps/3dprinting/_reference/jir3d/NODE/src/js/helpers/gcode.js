var fs = require("fs");

const searchGcodeParams = (path) => {
    return new Promise((resolve, reject) => {
        let output = {}
        // const output.data = fs.readFileSync(path)
        output.gcode = ""
        const h_pattern = /Layer height:.?\d+\.?\d*/
        const minx_pattern = /MINX:.?\d+\.?\d*/
        const miny_pattern = /MINY:.?\d+\.?\d*/
        const minz_pattern = /MINZ:.?\d+\.?\d*/
        const maxx_pattern = /MAXX:.?\d+\.?\d*/
        const maxy_pattern = /MAXY:.?\d+\.?\d*/
        const z_pattern = /MAXZ:.?\d+\.?\d*/
        const time_pattern = /TIME:.?\d+\.?\d*/
        const grams_pattern = /Filament used:.?\d+\.?\d*/
        fs.readFile(path, "utf8", (err, data) => {
            if (err) return reject(err)
            h_match = h_pattern.exec(data);
            minx_match = minx_pattern.exec(data);
            miny_match = miny_pattern.exec(data);
            minz_match = minz_pattern.exec(data);
            maxx_match = maxx_pattern.exec(data);
            maxy_match = maxy_pattern.exec(data);
            z_match = z_pattern.exec(data);
            time_match = time_pattern.exec(data);
            grams_match = grams_pattern.exec(data);

            const num_match = /\d+\.?\d*/
            if (minx_match && miny_match && maxx_match && maxy_match && z_match && h_match && time_match && grams_match) {
                let maxx, minx, maxy, miny
                minx = Number(num_match.exec(minx_match[0])[0]);
                miny = Number(num_match.exec(miny_match[0])[0]);
                maxx = Number(num_match.exec(maxx_match[0])[0]);
                maxy = Number(num_match.exec(maxy_match[0])[0]);
                output.z = Number(num_match.exec(z_match[0])[0]);
                output.h = Number(num_match.exec(h_match[0])[0]);
                output.time = Number(num_match.exec(time_match[0])[0]);
                output.grams = Number(num_match.exec(grams_match[0])[0]);
                output.x = Number((maxx - minx).toFixed(2))
                output.y = Number((maxy - miny).toFixed(2))
            }
            resolve(output);
        });
    })
}
module.exports = { searchGcodeParams }