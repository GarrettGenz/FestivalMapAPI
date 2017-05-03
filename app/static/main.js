/* global $, mapboxgl */

// the lines above declare global objects $ and mapboxgl for our linter, StandardJS.
// this stops the linter from throwing errors in the code editor since it doens't know about jQuery
// and mapboxgl existing since they are referenced with URLs in the index.html file.

// all the javascript code has been changed to be in keeping with StandardJS style.
// You can see standardJS at https://standardjs.com/
// It has linting plugins for many common text editors, such as Sublime or Atom.
// A linter is a tool that scans through the code and checks to see if it is in accordance
// with certain rules. If it is not, the editor will show you.
// This is a way to make your javascript code more readable, and keep everyone writing it in
// a somewhat similar fashion. It might seem a little odd at first, but it makes things much easier
// as you continue to collaborate and work on the same code, since you're all following
// the same guidelines for code formatting.

$(function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGFyb2JlcnRzMiIsImEiOiJjajB5MXp5MGcwMXExMnFxZHh0dnE3NHJ5In0.PVynsiXplfPuQG5DLsF14g'
  let map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/laroberts2/cj0y98x3000en2rntgs8c2orb',
    center: [-96, 37.8], // starting position
    zoom: 2.8 // starting zoom
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

    let festivalReturn
	
	var searchData = $.param({
						artist: $("#band-search").val().split(',') // Turn the comma separated artists into an array
						}, true);

    // Make API call to populate festivalReturn. Need to set async to false otherwise the function runs before the variable is initialized
    $.ajax({
      // url: "https://pacific-thicket-87363.herokuapp.com/festivals?artist=Chance the Rapper",
      url: '/festivals',
	  type: "get",
	  data: searchData,
      async: false,
      success: function (data) {
        festivalReturn = data
      }
    })

    let clusteredPoint = {
	        id: "clusters",
	        type: "circle",
					source: {
		        'type': 'geojson',
		        'data': festivalReturn,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 20 // Radius of each cluster when clustering points (defaults to 50)
          },
	        filter: ["has", "point_count"],
	        paint: {
	            "circle-color": {
	                property: "point_count",
	                type: "interval",
	                stops: [
	                    [0, "#51bbd6"],
	                    [100, "#f1f075"],
	                    [750, "#f28cb1"],
	                ]
	            },
	            "circle-radius": {
	                property: "point_count",
	                type: "interval",
	                stops: [
	                    [0, 20],
	                    [100, 30],
	                    [750, 40]
	                ]
	            }
	        }
	    }

    let clusteredLabel = {
        id: "cluster-count",
        type: "symbol",
        source: {
          'type': 'geojson',
          'data': festivalReturn,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 20 // Radius of each cluster when clustering points (defaults to 50)
        },
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        }
    }

    let unclusteredPoint = {
      id: 'unclustered-point',
      type: 'circle',
      source: {
        'type': 'geojson',
        'data': festivalReturn,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 20 // Radius of each cluster when clustering points (defaults to 50)
      },
      filter: ["!has", "point_count"],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    }

    map.addLayer(clusteredPoint)
    map.addLayer(clusteredLabel)
    map.addLayer(unclusteredPoint)
    // instead of having all of the logic of getting box bounds inside of the event listener,
    // (the $('#search-button').click thing), move the raw math calculations into a helper object
    // that lives outside of the document ready event and outside of the DOM manipulations and listeners.
    // DOM == Document Object Model, basically, the webpage itself.
    // Separation of concerns applies here. In fact, nearly all of the above (and some of the below) should be moved into other
    // more specific functions, but they can stay for now.
    let boundBoxParams = helpers.getBoundingBox(festivalReturn.features)
    map.fitBounds(boundBoxParams, { padding: 50 })

    // adds divs to bottom of page with info
    let festName
    let festCity

    // the below could be changed to use a for (let member of enumerableObject) syntax for clarity
    // I changed it to use the multiline JS syntax which uses backticks, ``, as quotes.
    // this lets you break lines, as well as use the string interpolation feature, `string here, ${variableHere}`
    // this is much more readable than using a single line of normal quotes, or by using "string" + variable + "more string"
    for (let i = 0; i < festivalReturn.features.length; i++) {
      festCity = festivalReturn.features[i].properties.city
      festName = festivalReturn.features[i].properties.name
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

      // Zooms the map in on a cluster when it is clicked.
      map.on('click', 'clusters', function (e) {
          map.easeTo({zoom: map.getZoom()+1,
                      around: e.features[0].geometry.coordinates})
      })

      // Change the cursor to a pointer when the mouse is over the cluster layer.
      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = ''
      })

    }
  })
})


// This is the helpers object. It doesn't need to worry about being inside of the document ready event,
// since it will not deal with the document at all, only with variables that are passed to its functions.
// It is declared as a const since it is a constant; its value will not change. It is simply a collection
// of helper functions that do things non-DOM related.
const helpers = {
  getBoundingBox: (festivals) => {
    // First initialize two empty arrays, one to hold latitudes, and one for longitudes
    let longs = []
    let lats = []
    // iterate over the festivals that are passed to the function.
    // You can use syntax: `for (let member of enumerableObject)` instead of a typical for loop
    // in fact, the syntax before roughly is the normal syntax now.
    for (let festival of festivals) {
      longs.push(festival.geometry.coordinates[0])
      lats.push(festival.geometry.coordinates[1])
    }
    // orders coordinates lowest-to-highest.
    longs.sort(function (a, b) { return a - b })
    lats.sort(function (a, b) { return a - b })
    // to get a proper bound box, take the lowest long and latitude value of all of the points for the SW corner,
    // and then take the highest long and lat values of all points for the NE corner.
    let boundBoxParams = [[longs[0], lats[0]], [longs[longs.length - 1], lats[lats.length - 1]]]
    return boundBoxParams
  }
}
