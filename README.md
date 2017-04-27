## FestivalFinder

#### Python Package list
* flask  
* flask_cors  
* psycopg2  
* python-dotenv
* virtualenv

#### How to run app
* Ensure you have Homebrew installed
* Install python3 with `$ brew install python3`
* Ensure you have virtualenv installed with `$ pip3 install virtualenv`
* environment variables are set in a .env file in the root directory. It is formatted `VARIABLE_1=VALUE_OF_VARIABLE1`  
* run `$ virtualenv --no-site-packages --distribute -p python3 virtualPy && source virtualPy/bin/activate && pip3 install -r requirements.txt` to setup virtualenv and install the required packages from requirements.txt
* run `$ export FLASK_APP=festivalMapAPI.py` to set the flask env variable to tell flask where the app is
* run `$ export FLASK_DEBUG=1` to set the flask server to debug mode with full logging & debug capability & auto-reload on change of python files
* run `$ flask run` to launch the app


// virtualenv -p python3 virtualPy
