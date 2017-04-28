/* global $, mapboxgl */

$(function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGFyb2JlcnRzMiIsImEiOiJjajB5MXp5MGcwMXExMnFxZHh0dnE3NHJ5In0.PVynsiXplfPuQG5DLsF14g'
  let map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/laroberts2/cj0y98x3000en2rntgs8c2orb',
    center: [-96, 37.8], // starting position
    zoom: 2 // starting zoom
  })

  $('.input-daterange').datepicker({
    autoclose: true,
    todayHighlight: true
  })

  $('#search-button').mouseenter(function () {
    $('#search-button').fadeTo('fast', 1)
  })
  $('#search-button').mouseleave(function () {
    $('#search-button').fadeTo('fast', 0.8)
  })
  $('#search-button').click(function () {
    // values from the search buttons
    // let artist = $("#band-search").val()
    // let zip = $("#zip-search").val()
    // let startDate = $("#start-date-search").val()
    // let endDate = $("#end-date-search").val()

    var festivalReturn

    // Make API call to populate festivalReturn. Need to set async to false otherwise the function runs before the variable is initialized
    $.ajax({
      // url: "https://pacific-thicket-87363.herokuapp.com/festivals?artist=Chance the Rapper",
      url: '/festivals?artist=Chance the Rapper',
      async: false,
      dataType: 'json',
      success: function (data) {
        festivalReturn = data
      }
    })

    console.log(festivalReturn)

    // retruned GEOJSON from  API call... currently dummy data
  // $.get( "test.php", { name: "John", time: "2pm" } )

    // this is the template festivalReturn is plugged into
    var festivalDisplay = {
      id: 'unclustered-point',
      type: 'circle',
      source: {
        'type': 'geojson',
        'data': festivalReturn
      },
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    }

      // adds layers to the map based on features in festivalReturn
    map.addLayer(festivalDisplay)

    // creates the bounding box and zooms to it in the map
    var longMin = 1000
    var longMax = -1000
    var latMin = 90 // Updated to true min
    var latMax = -90 // Updated to true max

    for (let i = 0; i < festivalReturn.length; i++) {
      if (festivalReturn[i].geometry.coordinates[0] < longMin) {
        longMin = festivalReturn[i].geometry.coordinates[0]
      } else {
        longMin = longMin
      }

      if (festivalReturn[i].geometry.coordinates[1] < latMin) {
        latMin = festivalReturn[i].geometry.coordinates[1]
      } else {
        latMin = latMin
      }

      if (festivalReturn[i].geometry.coordinates[0] > longMax) {
        longMax = festivalReturn[i].geometry.coordinates[0]
      } else {
        longMax = longMax
      }

      if (festivalReturn[i].geometry.coordinates[1] > latMax) {
        latMax = festivalReturn[i].geometry.coordinates[1]
      } else {
        latMax = latMax
      }
    }

    map.fitBounds([[longMin, latMin], [longMax, latMax]], { padding: 50 })

    // adds divs to bottom of page with info
    var festName = ''
    var festCity = ''

    for (let i = 0; i < festivalReturn.length; i++) {
      festCity = festivalReturn[i].properties.city
      festName = festivalReturn[i].properties.name
      $('#festivalTableContainer').append(`<div id='festivalTable' class='col-lg-10 col-mid-10 col-sm-10 col-xs-12 col-lg-offset-1 col-mid-offset-1 col-sm-offset-1' style='margin-top:10px'>
        <div class='col-lg-3 col-mid-3 col-sm-3 col-xs-3'>
          <h3 style='padding-bottom:10px'>
            <a href=# style='color:#2F4F65'>${festName}</a>
          </h3>
        </div>
        <div style='padding-top:15px' class='col-lg-3 col-mid-3 col-sm-3 col-xs-3'>
          <h4>${festCity}</h4>
        </div>
      </div>`)

    // When a click event occurs on a feature in the unclustered-point layer, open a popup at the
    // location of the feature, with description HTML from its properties.
      map.on('click', 'unclustered-point', function (e) {
        new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`<h3>
                      ${e.features[0].properties.name}
                    </h3>
                    <h4>${e.features[0].properties.city}
                    </h4>`)
          .addTo(map)
      })

      // Change the cursor to a pointer when the mouse is over the unclustered-point layer.
      map.on('mouseenter', 'unclustered-point', function () {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = ''
      })
    }
  })
})
