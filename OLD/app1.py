from flask import Flask, render_template
import pymongo

app = Flask(__name__)

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and collection
db = client.food_info
collection = db.food_impact


@app.route("/")
def index():
    # write a statement that finds all the items in the db and sets it to a variable
    info = list(db.collection.find())
    print(info)

    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html", info=info)

@app.route("/foodID")
def scraper():
    info = mongo.db.listings
    info.update({}, infodata, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
