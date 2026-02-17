from flask import Flask
from config import Config
from extensions import db, cors
from routes import restaurant_bp, menu_bp ,order_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app)

    app.register_blueprint(restaurant_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(order_bp)
    
    with app.app_context():
        from models import Restaurant, Table, MenuItem, Order, OrderItem
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)