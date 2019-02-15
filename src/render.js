import mainHtml from "./src/templates/main.html!text"
import rp from "request-promise"
import Mustache from "mustache"

const pageTitle = "How Brexit has created four new political factions"
const pageUrl = "https://gu.com/p/ah786"

const twitterLink = 'https://twitter.com/intent/tweet?text=' + encodeURI(pageTitle) + '&url=' + encodeURIComponent(pageUrl + '?CMP=share_btn_tw');
const facebookLink = 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(pageUrl + '?CMP=share_btn_fb');
const emailLink = 'mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent(pageUrl + '?CMP=share_btn_link');

export async function render() {
    const sheet = await rp("https://interactive.guim.co.uk/docsdata-test/1Nsa-6GKRpvy4HRr9n3osXquZJOQQo9W2QztecVi4qPc.json");
    return Mustache.render(mainHtml, Object.assign({}, JSON.parse(sheet).sheets, {twitterLink, facebookLink, emailLink })); 
} 