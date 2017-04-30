# -*- coding: utf-8 -*-
"""
Created on Sun Apr 09 19:52:56 2017

@author: Garrett
"""
import os # imports the native python package for operating system stuff
from dotenv import load_dotenv, find_dotenv # imports the dotenv package so we can access our ENV variables
load_dotenv(find_dotenv()) # continuation of above

DB_NAME = os.environ.get("DB_NAME") # use the dotenv package to assign our
DB_USERNAME = os.environ.get("DB_USERNAME") # ENV values to variables without having them hard-coded into the app
DB_URL = os.environ.get("DB_URL")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

from flask import Flask, jsonify, request, json, Response, render_template
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)
import psycopg2

# the line below uses python's string interpolation to put ENV variables defined above into the url string.
# instead of having an overly long line that opens our DB connection, first define the url that
# references the DB's location as a variable, then pass that variable into the DB connect function.
# This makes the code easier to understand for someone coming into it, and more readable, since there isn't
# a giant line to be parsed and understood that goes off the screen.
connURL = "dbname={} user={} host={} password={}".format(DB_NAME, DB_USERNAME, DB_URL, DB_PASSWORD)

try:
    conn = psycopg2.connect(connURL)
except:
    print("I am unable to connect to the database")

cur = conn.cursor()

@app.route('/', methods=['GET'])
def getHome():
    return render_template('index.html') # this line uses jinja2, Flask's native template engine, to render the index page.
    # That page is what Levi originally had as just a standalone html file. It is now served from the flask server at the index route,
    # which is localhost:5000, or '/', the naked domain route.
    # the template rendering part of jinja2 is imported in line 16 from the general flask package, as render_template
    # jinja2 is a powerful server-side templating engine. We can pass variables from the server here, and have them available
    # in the template itself. So if we had a value from the database, we could give it to the template file that will make an html page
    # which uses/includes those values from the database.

@app.route('/festivals', methods=['GET'])
def getFestivals():
    args = request.args.getlist('artist')

    # Query the database for any festival that has one of the artists entered
    cur.execute("""SELECT
                f.longitude,
                f.latitude,
            f.name,
                f.start_date,
            f.end_date,
            -- Get a complete list of artists for each festival
            (SELECT json_agg(artists.name) FROM artists JOIN festivalartists ON artists.artistid = festivalartists.artistid
            WHERE festivalartists.festivalid = f.festivalid) as artists
FROM	festivalartists fa JOIN festivals f ON fa.festivalid = f.festivalid
          JOIN artists a ON fa.artistid = a.artistid
WHERE	a.name IN ('%s')""" % ("','".join([str(i) for i in args])))

    festivals = cur.fetchall()

    festivalList = []

# I changed the below JSON from this:
# "geometry": {"type": "Point", "coordinates": [festival[0], festival[1]]},
# "properties": {"name": festival[2], "startDate": festival[3], "endDate": festival[4], "artists": festival[5]}})
# to what you see now. As much as possible, write code for the purpose of being easily read by people.
# Code is written primarily for other humans and yourself to understand, secondarily for the machine to execute.

    for festival in festivals:
        festivalList.append({ "type": "Feature",
                             "geometry": {
                                "type": "Point",
                                "coordinates": [festival[0], festival[1]]
                                },
                             "properties": {
                                "name": festival[2],
                                "startDate": festival[3],
                                "endDate": festival[4],
                                "artists": festival[5]
                              }
                            })

    return jsonify(type = 'FeatureCollection', features = festivalList)
