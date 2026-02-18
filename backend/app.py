from flask import Flask
from config import Config
from extensions import db, cors
from routes import restaurant_bp, menu_bp ,order_bp
from routes.auth_routes import auth_bp
from flask_jwt_extended import JWTManager



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config["JWT_SECRET_KEY"] = "super-secret-key-change-this"
    jwt = JWTManager(app)


    db.init_app(app)
    cors.init_app(app)

    app.register_blueprint(restaurant_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    
    with app.app_context():
        from models import Restaurant, Table, MenuItem, Order, OrderItem
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)