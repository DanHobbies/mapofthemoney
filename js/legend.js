'use strict';

mava.createLegendVerified = function( mode ){
  var div = $( '#legend_verified' );
  var array = [
    {
      verified: true,
      name: 'Verified data (includes percentiles)',
      size: mava.settings.VCrow.barSteps[0].from,
      min: 50000,
      percentile25: 100000,
      percentile75: 250000,
      max: 500000
    },
    {
      verified: true,
      name: 'Declared data',
      size: mava.settings.VCrow.barSteps[0].from,
      min: 50000,
      max: 500000
    },
    {
      verified: false,
      name: 'Estimated data',
      size: mava.settings.VCrow.barSteps[0].from,
      min: 50000,
      max: 500000
    }
  ];

  $.each( array, function( key, legendVC ){
    var oneBar = mava.createVCrow( legendVC, true );
    div.append( oneBar );
  });

  $.each( array, function( key, legendVC ){
    mava.updateVCrowPositionining( legendVC, mode );
  });
};

mava.createLegendHeight = function( mode ){
  var div = $( '#legend_heights' );
  var array = [];
  $.each( mava.settings.VCrow.barSteps, function( key, step ){
    array.push(
      {
        verified: true,
        name: step.text,
        size: step.from + 1,
        min: 50000,
        max: 500000
      }
    );
  });

  $.each( array, function( key, legendVC ){
    var oneBar = mava.createVCrow( legendVC, true );
    div.append( oneBar );
  });

  $.each( array, function( key, legendVC ){
    mava.updateVCrowPositionining( legendVC, mode );
  });
};

mava.createLegendValues = function( mode ){
  var div = $( '#legend_values' );
  var array = [
    { verified: true,
      min: 50000,
      max: 500000,
      size: 15000000,
      name: 'Tap on the bar to see the min, max and capital' },
    { verified: true,
      min: 50000,
      percentile25: 100000,
      percentile75: 375000,
      max: 500000,
      size: 25000000,
      name: 'Darker blue for 25 and 75% percentile values' }
  ];

  $.each( array, function( key, legendVC ){
    var oneBar = mava.createVCrow( legendVC );
    div.append( oneBar );
  });

  $.each( array, function( key, legendVC ){
    mava.updateVCrowPositionining( legendVC, mode );
  });
}
