import React from 'react'
import { hydrate } from 'react-dom'
import App from './components/App'
import divisions from './../assets/votesNew.json'
import 'core-js/es6/number';

let isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;
// var mousesliders = Array.from(document.querySelectorAll('.gv-slider'));
// var mousepic = document.querySelector('#mousepic')
// var wrapper = document.querySelector('.interactive-wrapper');

// let isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;

// wrapper.addEventListener("touchstart", e => {
//   if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
//     window.GuardianJSInterface.registerRelatedCardsTouch(true);
//   }
// })

// wrapper.addEventListener("touchend", e => {
//   if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
//     window.GuardianJSInterface.registerRelatedCardsTouch(false);
//   }
// })


// mousesliders.forEach(m => {

//   m.addEventListener("input", e => {
//     var pic = document.querySelector(`.gv-pol-mugshot#${m.id}`);
//     console.log(m.id)
//     var percent = 100 * (e.target.value / 2);
//     console.log(percent);
//     pic.style.left = `${percent}%`
//   })

//   m.addEventListener("change", e => {
//     console.log('change ' + m.id)
//     // need to add IE specific logic to handle repositioning here, because IE can't detect input
//     var answerpic = document.querySelector(`.gv-pol-answer-mugshot#${m.id}`);
//     answerpic.classList.add('gv-visible');
//   })

// })

hydrate(<App isAndroidApp={isAndroidApp} divisions={divisions} />, document.getElementById("interactive-wrapper"))





// pointless comment to validate commit