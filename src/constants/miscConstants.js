// export const logo = require('mypet/images/dogNcat.png');
export const logo = require('../images/dogNcat.png');
export const iconOreo = require('../images/icon-oreo.png');
export const icon = require('../images/icon.png');

// photoHeight is calculated by multiplying the 'typical screen width'
// by 3/4 (the aspect ratio of the captured photo/image)
//
// typical screen width is based on Galaxy S6/S7 and HTC One
// where dp (Density-independent Pixels) width = 360
// (multiplying by 3/4 provides 270)
// Note: we can get the exact Dimensions and calculate based on that
//       it is not that important, may be done in the future
// (not that important since if the screen width is larger, there will
//  be left/right margins,a nd if smaller top/bottom margins)
export const photoHeight = 270;

// max number of items to be read from the database and displayed
// (for medicalItems, Photos, etc.)
export const maxItems = 200;
