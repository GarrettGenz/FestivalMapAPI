# -*- coding: utf-8 -*-
"""
Created on Sun Apr 09 19:52:56 2017

@author: Garrett
"""
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

DB_NAME = os.environ.get("DB_NAME")
DB_USERNAME = os.environ.get("DB_USERNAME")
DB_URL = os.environ.get("DB_URL")
DB_PASSWORD = os.environ.get("DB_PASSWORD")

from flask import Flask, jsonify, request, json, Response
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)
import psycopg2

connURL = "dbname={} user={} host={} password={}".format(DB_NAME, DB_USERNAME, DB_URL, DB_PASSWORD)

try:
    conn = psycopg2.connect(connURL)
except:
    print("I am unable to connect to the database")

cur = conn.cursor()

@app.route('/festivals', methods=['GET'])
def getFestivals():
    args = request.args.getlist('artist')

#    print artistList

    # Query the database for any festival that has one of the artists entered
    cur.execute("""SELECT
                f.latitude,
                f.longitude,
            f.name,
                f.start_date,
            f.end_date,
            -- Get a complete list of artists for each festival
            (SELECT json_agg(artists.name) FROM artists JOIN festivalartists ON artists.artistid = festivalartists.artistid
            WHERE festivalartists.festivalid = f.festivalid) as artists
FROM	festivalartists fa JOIN festivals f ON fa.festivalid = f.festivalid
          JOIN artists a ON fa.artistid = a.artistid
WHERE	a.name IN ('%s')""" % ("','".join([str(i) for i in args])))

#    print cur.query

    festivals = cur.fetchall()

    festivalList = []

    for festival in festivals:
        festivalList.append({ "type": "Feature",
                             "geometry": {"type": "Point", "coordinates": [festival[0], festival[1]]},
                             "properties": {"name": festival[2], "startDate": festival[3], "endDate": festival[4], "artists": festival[5]}})

    return jsonify(type = 'FeatureCollection', features = festivalList)
