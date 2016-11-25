'use strict';

// doubling at every unit
mava.getUnitWidth = function(){
  mava.settings.unitWidth = {
    max: 0,
  };

  mava.settings.mapDiv.width = $('#map').width() - mava.settings.mapDiv.margins.left - mava.settings.mapDiv.margins.right;

  $.each( mava.data, function( index, value ) {
    if( value.max > 0 && value.max > mava.settings.unitWidth.max ){
      mava.settings.unitWidth.max = value.max;
    }
  });

  mava.settings.steps = [0];
  var i = 0;
  var previousStep = 0;

  while( previousStep <= mava.settings.unitWidth.max ){
    previousStep = mava.settings.scaleStepValue * Math.pow(2,i);
    i++;
    mava.settings.steps.push( previousStep );
  }
  mava.settings.stepWidth = mava.settings.mapDiv.width / ( mava.settings.steps.length - 1 );

  mava.settings.scalePoints = [ 0, 125000, 250000,500000,1000000,2000000,4000000,8000000,16000000,32000000 ];
};

mava.getPosition = function( value ){
  var rangeStep = 0;
  $.each( mava.settings.steps, function( index, stepValue ){
    if( value >= stepValue ){
      rangeStep = index;
    }
  });

  //console.log( 'getPosition for:' + value + ' found at step:' + rangeStep );

  var domain = [];
  var domainStart = rangeStep >= 1? Math.pow(2,rangeStep-1): 0;
  domain.push( mava.settings.scaleStepValue * domainStart );
  domain.push( mava.settings.scaleStepValue * Math.pow(2,rangeStep) );
  //console.log( domain );

  var range = [];
  range.push( mava.settings.stepWidth * rangeStep );
  range.push( mava.settings.stepWidth * ( rangeStep + 1 ) );
  //console.log( range );

  var axisScale = d3.scaleLinear()
    .domain(domain)
    .range(range);

  return mava.settings.mapDiv.margins.left + axisScale( value );
};

mava.getWidth = function( value1, value2 ){
  var position1 = mava.getPosition( value1 );
  var position2 = mava.getPosition( value2 );

  //Enforce a min width
  return Math.max( mava.settings.minBarWidth, position2 - position1 );
};


mava.getValueForPosition = function( position ){
  var step = position / mava.settings.stepWidth;
  var fullStep = Math.floor( step );
  var value = mava.settings.steps[ fullStep ];

  if( fullStep === 0 ){
    value = ( step - fullStep ) * mava.settings.scaleStepValue;
  }else{
    value = value + value * ( step - fullStep ) ;//as each step is doubling in value, we can use the same
  }

  // round it
  var rounding = 25000;
  if( value > 10000000 ){
    rounding = 1000000;
  }else if( value > 1000000 ){
    rounding = 100000;
  }else if( value > 250000){
    rounding = 50000;
  }
  value = Math.round(value/rounding) * rounding;

  return value;
}
