console.log( 'Hi curious person; Want to help develop the Map of the Money? Contact:');
console.log( 'http://github.com/floriancornu');

var mava = {
  settings: {
    ga: 'UA-83148445-1',
    body:{
      margin:{
        left: 10 //Used for click position offset; should match the body.margin-left css value
      }
    },
    mapDiv:{
      margins:{
        left: 30,
        right: 30
      }
    },
    VCrow: {
      textHeight: 20,
      defaultBarHeight: 10,
      barHeightSteps: 5,
      barSteps:[
        {
          from: 250000000,
          text: '≥ US$250m of capital'
        },
        {
          from: 100000000,
          text: '≥ US$100m of capital and < $250m'
        },
        {
          from: 10000000,
          text: '≥ US$10m of capital and < $100m'
        },
        {
          from: 0,
          text: '< $10m of capital'
        }
      ]
    },
    scaleStepValue: 125000, //so it does 250,500,1m,2,4,8,16m
    scalePoints: [],
    minBarWidth: 10
  }
};
