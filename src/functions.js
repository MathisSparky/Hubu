const fs = require("fs");
const path = require("path");

function addToElement(element, contentToAdd) {
    if (typeof element !== 'string') {
        console.log('\x1b[31mInvalid HTML element.\x1b[0m');
        return element;
    }
    const tagNameMatch = element.match(/^<\s*([^\s>]+)/);
    const tagName = tagNameMatch ? tagNameMatch[1] : null;
    if (tagName) {
        const closingTag = `</${tagName}>`;
        const updatedElement = element.replace(closingTag, `${contentToAdd}${closingTag}`);
        return updatedElement;
    } else {
        console.log('\x1b[31mInvalid HTML element format.\x1b[0m');
        return element;
    }
}
function rmInDir(directoryPath) {
    fs.readdirSync(directoryPath).forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        if (isDirectory) {
            removeDirectoryContents(filePath);
            fs.rmdirSync(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    });
}

module.exports = { addToElement, rmInDir };