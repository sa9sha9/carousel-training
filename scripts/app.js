'use strict';

import data from './data.js'
import {Carousel} from './carousel.js'


// make instance of carousel
const carousels = []
for(let d of data) {
    carousels.push(new Carousel(d))
}

// get init index
const params = (new URL(document.location)).searchParams;
let initIndex = parseInt(params.get("init"))
if ( !(initIndex > -1) ) {
    initIndex = 0
}

// init
for(let carousel of carousels) {
    carousel.init(initIndex)
}


