from flask import Blueprint, request, jsonify
from extensions import db
from models import MenuItem

menu_bp = Blueprint('menu_bp', __name__)

@menu_bp.route('/menu/add', methods=['POST'])
def add_menu_item():
    data = request.json

    name = data.get('name')
    price = data.get('price')
    restaurant_id = data.get('restaurant_id')

    if not name or not price or not restaurant_id:
        return jsonify({"error": "All fields required"}), 400

    item = MenuItem(
        name=name,
        price=price,
        restaurant_id=restaurant_id
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Menu item added"}), 201


@menu_bp.route('/menu/<int:restaurant_id>', methods=['GET'])
def get_menu(restaurant_id):
    items = MenuItem.query.filter_by(restaurant_id=restaurant_id).all()

    menu_list = []

    for item in items:
        menu_list.append({
            "id": item.id,
            "name": item.name,
            "price": item.price
        })

    return jsonify(menu_list)
