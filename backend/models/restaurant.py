from extensions import db

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    slug = db.Column(db.String(100), unique = True, nullable = False)
    upi_id = db.Column(db.String(100), nullable = False)