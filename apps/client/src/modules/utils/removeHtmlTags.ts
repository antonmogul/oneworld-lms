export const removeHTMLTags = (input) => {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export const removeH5Tags = (input) => {
    return input.replace(/<\/?h5>/g, "");
} 