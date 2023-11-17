const fs = require("fs");
const beautify = require("../node_modules/js-beautify").html;

const { addToElement, rmInDir } = require("./functions");

let variables = {};

if (!fs.existsSync("../node_modules")) {
    if (process.platform === "win32") {
        console.log("\x1b[31mPlease install the dependencies before trying to generate HTML. Run the dep-win.exe file.\x1b[0m");
    } else if (process.platform === "linux") {
        console.log("\x1b[31mPlease install the dependencies before trying to generate HTML. Run the dep-linux file.\x1b[0m");
    } else if (process.platform === "darwin") {
        console.log("\x1b[31mPlease install the dependencies before trying to generate HTML. Run the dep-macos file.\x1b[0m");
    } else {
        console.log("\x1b[31mYour platform isn't supported.\x1b[0m");
    }
}

if (fs.existsSync("./scripts")) {
    fs.readdir("./scripts", "utf-8", function (err, files) {
        if (err) {
            console.log(err);
        }
        files.forEach(function (file) {
            if (file.endsWith(".html")) {
                fs.readFile("./scripts/" + file, "utf-8", function (err, data) {
                    if (err) {
                        console.log(err);
                    }
    
                    let importer = data.matchAll(/import\s*\((.*)\)/g);
                    for (let imp of importer) {
                        if (fs.existsSync(imp[1])) {
                            const importedContent = fs.readFileSync(imp[1], "utf-8");
                            data = data.replace(imp[0], importedContent);
                        } else {
                            console.log("\x1b[31mThe file you imported doesn't exist!\x1b[0m");
                            process.exit(1);
                        }
                    }
    
                    
                    let variableMatches = data.matchAll(/set\s(.*)\s*=\s*\(\s*([\s\S]*?)\s*\)/g);
                    
                    for (let variable of variableMatches) {
                        variables[variable[1].trim()] = variable[2];
                    }
    
                    let gebi = data.matchAll(/gethid\s*\((.*)\s*\,\s*\(([\s\S]*?)\)\)/g);
    
                    for (let gb of gebi) {
                        let element = data.match(new RegExp(`<[^>]+\\s+hid="${gb[1]}">(.*?)<\\/[^>]+>`))[0];
                        let elementHTML = addToElement(element, gb[2]);
                        data = data.replace(element, elementHTML);
                    }
    
                    let variableValueMatches = data.matchAll(/\{(.*)\}/g);
    
                    for (let variableValue of variableValueMatches) {
                        let variableName = variableValue[1].trim();
                        data = data.replace(new RegExp(`\\{${variableName}\\}`, 'g'), variables[variableName]);
                    }
    
                    data = data.replace(/set\s(.*)\s*=\s*\(\s*([\s\S]*?)\s*\)/g, "");
                    data = data.replace(/gethid\s*\((.*)\s*\,\s*\(([\s\S]*?)\)\)/g, "");
                    data = data.replace(/hid\s*=\s*".*"/g, '');

                    if (fs.existsSync("./generated")) {
                        rmInDir("./generated");
                    }
                    if (fs.existsSync("./generated")) {
                        fs.writeFile(`./generated/${file.slice(0, -5)}.html`, beautify(data, { indent_size: 2 }), function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                        console.log("\x1b[32mSuccessfully generated the HTML.\x1b[0m");
                    } else {
                        fs.mkdirSync("./generated");
                        fs.writeFile(`./generated/${file.slice(0, -5)}.html`, beautify(data, { indent_size: 2 }), function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                        console.log("\x1b[32mSuccessfully generated the HTML.\x1b[0m");
                    }
                });
            }
        });
    });
} else {
    fs.mkdirSync("./scripts");
}