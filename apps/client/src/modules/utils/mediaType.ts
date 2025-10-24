export const extractMediaType = (fileName) => {
    // Regular expression to match file extensions
    const fileExtensionRegex = /(?:\.([^.]+))?$/;

    const match = fileName.match(fileExtensionRegex);
    if (match) {
        return match[0].substr(1);
    } else {
        return "Unknown";
    }
}