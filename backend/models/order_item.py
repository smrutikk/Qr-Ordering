from extensions import db

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey('order.id'),
        nullable=False
    )

    menu_item_id = db.Column(
        db.Integer,
        db.ForeignKey('menu_item.id'),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', backref='items')
    menu_item = db.relationship('MenuItem')
