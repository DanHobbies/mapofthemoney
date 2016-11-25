'use strict';

/** Define the row based on VC AUM **/
mava.getRowVerticalHeight = function( rowData ){
  if( mava.settings.mode === 'horizontal' ){
    mava.settings.barHeightAdditional = 10;
  }else{
    mava.settings.barHeightAdditional = 0;
  }
  var barHeightStep = null;

  $.each( mava.settings.VCrow.barSteps, function( key, step ){
    if( step.from && rowData.size >= step.from && !barHeightStep ){
      barHeightStep = mava.settings.VCrow.barSteps.length - key - 1;
    }
  });
  if( !barHeightStep ){
    barHeightStep = 0;
  }
  rowData.barHeight = mava.settings.VCrow.defaultBarHeight + mava.settings.VCrow.barHeightSteps * barHeightStep + mava.settings.barHeightAdditional;
  return rowData.barHeight;
};



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
};



mava.numberFormatting = function( number ){
  var numberCopy = number + 0;
  var symbol = '';
  var precision = 0;
  if( numberCopy >= 1000000000 ){
    numberCopy = numberCopy / 1000000000;
    symbol = 'bn';
    precision = 1;
  }else if( numberCopy >= 100000000 ){
    numberCopy = numberCopy / 1000000;
    symbol = 'm';
    precision = 0;
  }else if( numberCopy >= 1000000 ){
    numberCopy = numberCopy / 1000000;
    symbol = 'm';
    precision = 1;
  }else if( numberCopy >= 1000 ){
    numberCopy = numberCopy / 1000;
    symbol = 'k';
  }

  //Don't show decimal if the decimal is 0;
  if( +numberCopy.toFixed(0) === +numberCopy.toFixed(1) ){
    precision = 0;
  }

  return accounting.formatMoney( numberCopy, { symbol: symbol,  format: '%v%s', precision: precision });
};



mava.getVerifiedStatus = function( VCdata ){
  var barClass = 'estimate';
  if( VCdata.verified ){
    barClass = 'verified';
  }
  return barClass;
};



mava.getValuesTopPosition = function( VCdata, mode ){
  if( mode === 'vertical' ){
    return mava.settings.VCrow.textHeight + ( VCdata.barHeight - mava.settings.VCrow.defaultBarHeight ) / 2;
  }else{
    return ( VCdata.barHeight - mava.settings.VCrow.defaultBarHeight ) / 2;
  }
};



mava.getRowHeight = function( VCdata, mode ){
  if( mode === 'vertical' ){
    return ( VCdata.barHeight + mava.settings.VCrow.textHeight );
  }else{
    return VCdata.barHeight;
  }
};



mava.createVCrow = function( VCdata, hideValues ){
  var VCdiv, VCdivId;

  function addIDproperty( VCdata ){
    if( VCdata.name ){
      VCdata.id = VCdata.name.replace( /[^a-zA-Z0-9]/g , '' ).toLowerCase();
    }
  }

  function generateNameAndCapitalHTML(){
    var html = '<div class="VCname">';
    var url;
    if( VCdata.url ){
      url = VCdata.url;
      if( ! /^http/.test( url ) ){
        url = 'http://' + url;
      }
      html += '<a href="' + url + '" target="_blank" class="VClink values"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>';
    }

    if( VCdata.name ){
      html += '<b>' + VCdata.name + '</b>';
    }
    if( VCdata.size && VCdata.size > 0 ){
      html += '<span class="values"> - US$' + mava.numberFormatting( VCdata.size ) + '</span>';
    }else{
      html += '<span class="values"> - unknown</span>';
    }
    html += '</div>';
    return html;
  }

  function generateInvestmentSizeBar(){
    var html = '';
    var barVerifiedClass = mava.getVerifiedStatus( VCdata );
    html += '<div class="investmentSize ' + barVerifiedClass + '"></div>';

    if( VCdata.min >= 0 && VCdata.max >= 0 && ( VCdata.min + VCdata.max ) > 0 ){
      html += '<div class="values barValues minValue">' + mava.numberFormatting( VCdata.min ) + '</div>';
      html += '<div class="values barValues maxValue">' + mava.numberFormatting( VCdata.max ) + '</div>';
    }
    return html;
  }

  function generatePercentileBar(){
    var html = '';
    if( VCdata.verified && VCdata.percentile25 > 0 && VCdata.percentile75 > 0 ){
      html += '<div class="investmentPercentile"></div>';
      html += '<div class="values barValues percentiles percentile25value">' + mava.numberFormatting( VCdata.percentile25 ) + '</div>';
      html += '<div class="values barValues percentiles percentile75value">' + mava.numberFormatting( VCdata.percentile75 ) + '</div>';
    }
    return html;
  }

  addIDproperty( VCdata );

  if( VCdata.id ){
    VCdivId = 'id="' + VCdata.id + '"';
  }

  var filter = 'filter ';
  if( VCdata.filter ){
    filter += VCdata.filter;
  }

  var additionalClass = '';
  if( hideValues ){
    additionalClass = ' noValues';
  }
  VCdiv = '<div class="oneVC ' + filter + '" ' + VCdivId + '>';

  VCdiv += generateNameAndCapitalHTML();
  VCdiv += generateInvestmentSizeBar();
  VCdiv += generatePercentileBar();

  VCdiv += '</div>';

  if( VCdata.id && VCdata.id.length > 1 ){
    return VCdiv;
  }else{
    return false;
  }
};


mava.updateVCrowPositionining = function( VCdata, mode ){
  var VCdivId;
  if( !VCdata.id ){
    console.log( 'no ID for this VC' );
    console.dir( VCdata );
    return;
  }
  VCdivId = '#' + VCdata.id;

  function positionInvestmentSizeBar(){
    if( VCdata.min >= 0 && VCdata.max >= 0 ){
      var valueTopPosition = mava.getValuesTopPosition( VCdata, mode );
      VCdata.position.investmentSizeWidth = mava.getWidth( VCdata.min, VCdata.max );

      $( VCdivId + ' .investmentSize' ).css( 'left', VCdata.position.leftPosition );
      $( VCdivId + ' .investmentSize' ).css( 'width', VCdata.position.investmentSizeWidth );
      $( VCdivId + ' .investmentSize' ).css( 'height', VCdata.barHeight );

      $( VCdivId + ' .minValue' ).css( 'width', VCdata.position.leftPosition - 3 );
      $( VCdivId + ' .maxValue' ).css( 'left', VCdata.position.leftPosition + VCdata.position.investmentSizeWidth + 3 );

      $( VCdivId + ' .values' ).css( 'top', valueTopPosition);
    }else{
      console.log( VCdivId + ' has no min and max' );
      console.dir( VCdata );
    }
    if( mode !== 'vertical' ){
      $( VCdivId + ' .minValue' ).css('top',1);
      $( VCdivId + ' .maxValue' ).css('top',1);
      $( VCdivId + ' .values' ).css( 'top', valueTopPosition);
      $( VCdivId + ' .investmentPercentile' ).css('top',0);
    }
  }

  function positionPercentiles(){
    if( VCdata.percentile25 > 0 && VCdata.percentile75 > 0 ){
      VCdata.position.percentilePosition = {
        left: 0,
        width: 0
      };
      VCdata.position.percentilePosition.left = mava.getPosition( VCdata.percentile25 );
      VCdata.position.percentilePosition.width = mava.getWidth( VCdata.percentile25, VCdata.percentile75 );
      $( VCdivId + ' .investmentPercentile' ).css( 'left', VCdata.position.percentilePosition.left );
      $( VCdivId + ' .investmentPercentile' ).css( 'width', VCdata.position.percentilePosition.width );
      $( VCdivId + ' .investmentPercentile' ).css( 'height', VCdata.barHeight );

      //Hide percentile values if not enough space
      if( ( VCdata.position.percentilePosition.left - VCdata.position.leftPosition ) < 30 ){
        $( VCdivId + ' .percentile25value' ).hide();
      }
      var percentile75 = VCdata.position.percentilePosition.left + VCdata.position.percentilePosition.width;
      var max = VCdata.position.leftPosition + VCdata.position.investmentSizeWidth;
      if( ( max - percentile75 ) < 30 ){
        $( VCdivId + ' .percentile75value' ).hide();
      }

      $( VCdivId + ' .percentile25value' ).css( 'width', VCdata.position.percentilePosition.left - 3 );
      $( VCdivId + ' .percentile75value' ).css( 'left', VCdata.position.percentilePosition.left + VCdata.position.percentilePosition.width + 3 );
    }
  }

  mava.getRowVerticalHeight( VCdata );
  $( VCdivId ).css( 'height', mava.getRowHeight( VCdata, mode ) );
  VCdata.position = {};
  VCdata.position.leftPosition = mava.getPosition( VCdata.min );

  $( VCdivId + ' .VCname' ).css( 'left', VCdata.position.leftPosition );
  if( mode !== 'vertical' ){
    $( VCdivId + ' .investmentSize' ).css('top',0);
  }

  positionInvestmentSizeBar();
  positionPercentiles();
};


mava.sortVCs = function(){

  mava.data = mava.data.sort( function( a, b ){
    //by name // not working
    // var nameA = a.name.toUpperCase();
    // var nameB = b.name.toUpperCase();
    // console.log( '-- ' + nameA + ' < ' + nameB + ' ? ' + (nameA < nameB) );
    // if( nameA < nameB ){
    //   return 1;
    // }else if( nameB > nameA ){
    //   return -1;
    // }else{
    //   return 0;
    // }

    if( a.min && b.min ){
      return - ( a.min - b.min );
    }else{
      return false;
    }
  });
};

mava.addVCs = function( mode ){
  mava.settings.mode = mode;
  if( mava.data ){
    mava.sortVCs();
    var mapDiv = $( '#map' );

    //Create row
    $.each( mava.data, function( index, value ) {
      var VCdiv = mava.createVCrow( value );
      if( VCdiv ){
        mapDiv.append( VCdiv );
      }
    });

    // Real Positioning
    $.each( mava.data, function( index, value ) {
      mava.updateVCrowPositionining( value, mode );
    });
  }else{
    console.log( 'no data' );
    console.dir( mava );
  }
};

mava.activeTapping = function(){
  $( '.oneVC' ).on( 'click', function(){
    $(this).toggleClass('showValues');
    ga('send', 'event', 'action on a VC', 'tap', this.id );
  });
};

mava.addScale = function(){
  var scaleDiv = $( '#xaxis' );
  var scaleLines = $( '#scaleLines' );

  var scalePoints = mava.settings.scalePoints;

  var scalePoint, scaleLine;
  $.each( scalePoints, function( index, value ){
    scalePoint = '<div class="scaleValue" id="' + value + '">' + mava.numberFormatting( value ) + '</div>';
    scaleDiv.append( scalePoint );

    scaleLine = '<div class="scaleLine" id="' + value + '"></div>';
    scaleLines.append( scaleLine );
  });

  $.each( scalePoints, function( index, value ){
    var scalePointDiv = $( '.scaleValue#' + value );
    scalePointDiv.css( 'left', mava.getPosition( value ) );

    var scaleLineDiv = $( '#scaleLines #' + value );
    scaleLineDiv.css( 'left', mava.getPosition( value ) );
  });

  scaleDiv.on( 'click', function( event ){
    if( mava.getValueForPosition ){
      mava.removeFilter(); //delete previous one
      var clickDivPosition = event.pageX - mava.settings.body.margin.left - mava.settings.mapDiv.margins.left;
      var clickedValue = mava.getValueForPosition( clickDivPosition );

      $( '#map' ).css( 'margin-top', 0 );

      if( clickedValue ){
        var number = 0;
        var aums = 0;
        $.each( mava.data, function( index, value ) {
          if( value.min <= clickedValue && clickedValue <= value.max ){
            $( '.oneVC#' + value.id ).removeClass( 'blur' );
            number++;
            aums += value.size;
          }else{
            $( '.oneVC#' + value.id ).addClass( 'blur' );
          }
        });
        var value = 'US$' + mava.numberFormatting( clickedValue );

        $('#filter').show().html('<b>' + number + ' VCs (US$' + mava.numberFormatting(aums)+') doing ' + value + ' investments</b><br /><small><a href="#" onclick="mava.removeFilter();">remove highlight</a></small>' );
        ga('send', 'event', 'Filter', 'tap axis', value );

        // Show the clicked line
        var scaleDiv = $( '#xaxis' );
        var scaleLines = $( '#scaleLines' );

        var filterPoint = '<div class="scaleValue" id="filterPoint">' + value + '</div>';
        scaleDiv.append( filterPoint );

        scaleLine = '<div class="scaleLine" id="filterLine"></div>';
        scaleLines.append( scaleLine );

        var scalePointDiv = $( '#filterPoint' );
        scalePointDiv.css( 'left', mava.getPosition( clickedValue ) );

        var scaleLineDiv = $( '#filterLine' );
        scaleLineDiv.css( 'left', mava.getPosition( clickedValue ) );
      }
    }
  });

  //Reactive all blur
  scaleDiv.on( 'dblclick', function(){
    mava.removeFilter();
  });
};

mava.removeFilter = function(){
  $( '#map' ).css( 'margin-top', 0 );
  $( '#filterPoint' ).remove();
  $( '#filterLine' ).remove();
  $( '.oneVC' ).removeClass( 'blur' );
  $( '#filter' ).hide();
};


mava.showMailchimpPopup = function(){
  console.log( 'showMailchimpPopup');
  require(['mojo/signup-forms/Loader'], function(L) { L.start({
    'baseUrl':'mc.us14.list-manage.com',
    'uuid':'eae27e7aeb5d0a4b1a9285466',
    'lid':'92d890747a'});
  });
};
