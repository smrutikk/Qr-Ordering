from extensions import db

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

    restaurant_id = db.Column(
        db.Integer, 
        db.ForeignKey('restaurant.id'),
        nullable=False
    )

    restaurant = db.relationship('Restaurant', backref='menu_items')