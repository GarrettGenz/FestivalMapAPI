/* global $, mapboxgl */

$(function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGFyb2JlcnRzMiIsImEiOiJjajB5MXp5MGcwMXExMnFxZHh0dnE3NHJ5In0.PVynsiXplfPuQG5DLsF14g'
  let map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/laroberts2/cj0y98x3000en2rntgs8c2orb',
    center: [-96, 37.8], // starting position
    zoom: 0 // starting zoom
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

    let festivalDisplay = {
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

    map.addLayer(festivalDisplay)
    // debugger
    let boundBoxParams = helpers.getBoundingBox(festivalReturn.features)
    map.fitBounds(boundBoxParams, { padding: 50 })

    // adds divs to bottom of page with info
    let festName
    let festCity

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
                    <h4>
                      ${e.features[0].properties.city}
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

const helpers = {
  getBoundingBox: (festivals) => {
    let longs = []
    let lats = []
    for (let festival of festivals) {
      longs.push(festival.geometry.coordinates[0])
      lats.push(festival.geometry.coordinates[1])
    }
    // orders coords lowest-to-highest so we can get NE & SW corners
    longs.sort(function (a, b) { return a - b })
    lats.sort(function (a, b) { return a - b })

    let boundBoxParams = [[longs[0], lats[0]], [longs[longs.length - 1], lats[lats.length - 1]]]
    return boundBoxParams
  }
}
