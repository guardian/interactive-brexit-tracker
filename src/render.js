
import templateHTML from "./src/templates/main.html!text"
import rendersnap from './rendersnaps'

export async function render() {

    try {
        await rendersnap();
    }
    catch (err) {
        console.log(err);
    }

    return templateHTML;
}