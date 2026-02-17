from extensions import db

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, 
        db.ForeignKey('restaurant.id'), 
        nullable=False
    )
    table_number = db.Column(db.Integer, nullable=False)

    restaurant = db.relationship('Restaurant', backref='tables')