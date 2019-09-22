from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine
import numpy as np
from flask_sqlalchemy import SQLAlchemy
from flask_heroku import Heroku
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# setup Postgres connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/EnvironmentalData'
heroku = Heroku(app)
db = SQLAlchemy(app)

class EnvironmentalData(db.Model):
    __tablename__ = "NurtritionData"
    Food_ID = db.Column(db.String, primary_key=True)
    Name = db.Column(db.Numeric)
    Energy_kcal = db.Column(db.Numeric)
    Carbohydrates_g = db.Column(db.Numeric)
    Fat_g = db.Column(db.Numeric)
    Fiber_g = db.Column(db.Numeric)
    Protein_g = db.Column(db.Numeric)
    Sugar_g = db.Column(db.Numeric)
    Type = db.Column(db.String)
    Group = db.Column(db.String)

    __tablename__ = "clean_environment_data"
    Product = db.Column(db.String, primary_key=True)
    NutrUnits = db.Column(db.Numeric)
    LandUse = db.Column(db.Numeric)
    CO2Emissions = db.Column(db.Numeric)
    SO2Emissions = db.Column(db.Numeric)
    PO4Emissions = db.Column(db.Numeric)
    FreshwaterWithdrawals = db.Column(db.Numeric)
    Type = db.Column(db.String)

# reflect an existing database into a new model
#Base = automap_base()
# reflect the tables
#Base.prepare(engine, reflect=True)

# Save reference to the table
#NutritionData = Base.classes.NutritionData
#clean_environment_data = Base.classes.clean_environment_data

@app.route("/")
def welcome():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/foodtypes<br/>"
        f"/api/v1.0/foodproducts"
    )

@app.route("/api/v1.0/foodtypes")
def names():
    # session = Session(engine)
    results = db.session.query(NutritionData.Group).all()

    # Convert list of tuples into normal list
    all_groups = list(np.ravel(results))

    return jsonify(all_groups)


@app.route("/api/v1.0/foodproducts")
def types():

    #session2 = Session(engine)
    results2 = db.session.query(clean_environment_data.Product).all()

    # Convert list of tuples into normal list
    all_groups2 = list(np.ravel(results2))

    return jsonify(all_groups2)
   
if __name__ == "__main__":
    app.run(debug=True)
