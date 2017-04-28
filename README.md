## FestivalFinder

#### Python Package list
* flask  
* flask_cors  
* psycopg2  
* python-dotenv
* virtualenv

#### How to run app
* Clone this app to your local destination (desktop on OSX)
* Ensure you have Homebrew installed
* Install python3 with `$ brew install python3`
* Ensure you have virtualenv installed with `$ pip3 install virtualenv`
* environment variables are set in a .env file in the root directory. It is formatted `VARIABLE_1=VALUE_OF_VARIABLE1`  
* run `$ virtualenv --no-site-packages --distribute -p python3 virtualPy && source virtualPy/bin/activate && pip3 install -r requirements.txt` to setup virtualenv and install the required packages from requirements.txt
* run `$ export FLASK_APP=app/server.py` to set the flask env variable to tell flask where the app is
* run `$ export FLASK_DEBUG=1` to set the flask server to debug mode with full logging & debug capability & auto-reload on change of python files
* run `$ flask run` to launch the app

#### How to run app (Windows)
* Clone this app to your local destination
* Install python 3.6 (https://www.python.org/ftp/python/3.6.1/python-3.6.1-amd64.exe)
* Ensure you have virtualenv installed with `$ pip install virtualenv`
* environment variables are set in a .env file in the root directory. It is formatted `VARIABLE_1=VALUE_OF_VARIABLE1`  
* run `$ virtualenv --no-site-packages --distribute -p python virtualPy && virtualPy\Scripts\activate && pip install -r requirements.txt` to setup virtualenv and install the required packages from requirements.txt
* run `$ set FLASK_APP=app/server.py` to set the flask env variable to tell flask where the app is
* run `$ set FLASK_DEBUG=1` to set the flask server to debug mode with full logging & debug capability & auto-reload on change of python files
* run `$ flask run` to launch the app
* navigate to 127.0.0.1:5000 to open the web interface

// virtualenv -p python3 virtualPy

#### Making Changes
Add your changes and commit them. Please run `$ git pull --rebase origin develop` to make sure any changes that are upstream from your instance are pulled in and added. If there are any merge conflicts, solve them, add the files, commit them, re-pull with rebase, and then run `$ git push origin develop` now that nothing you added will be overwriting stuff on GitHub. 
