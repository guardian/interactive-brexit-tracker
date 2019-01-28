import mainHtml from "./src/templates/main.html!text"
import rp from "request-promise"
import Mustache from "mustache"

export async function render() {
    const sheet = await rp("https://interactive.guim.co.uk/docsdata-test/1Nsa-6GKRpvy4HRr9n3osXquZJOQQo9W2QztecVi4qPc.json");
    return Mustache.render(mainHtml, JSON.parse(sheet).sheets); 
} 