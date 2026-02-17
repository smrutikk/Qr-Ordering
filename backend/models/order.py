from extensions import db
from datetime import datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey('restaurant.id'),
        nullable=False
    )

    table_id = db.Column(
        db.Integer,
        db.ForeignKey('table.id'),
        nullable=False
    )

    status = db.Column(db.String(20), default = 'pending')
    total_amount = db.Column(db.Float, default = 0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    restaurant = db.relationship('Restaurant', backref='orders')
    table = db.relationship('Table')