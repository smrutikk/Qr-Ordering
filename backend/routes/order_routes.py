from flask import Blueprint, request, jsonify
from extensions import db
from models import Order, OrderItem, MenuItem, Restaurant, Table
from datetime import datetime
from flask_jwt_extended import jwt_required


order_bp = Blueprint('order_bp', __name__)

def generate_upi_link(upi_id, name, amount):
    return f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"

@order_bp.route('/order/create', methods=['POST'])
def create_order():
    data = request.json

    restaurant_id = data.get('restaurant_id')
    table_id = data.get('table_id')
    items = data.get('items')

    if not restaurant_id or not table_id or not items:
        return jsonify({"error": "All fields required"}), 400

    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    table = Table.query.get(table_id)
    if not table or table.restaurant_id != restaurant_id:
        return jsonify({"error": "Invalid table for this restaurant"}), 400
    
    new_order = Order(
        restaurant_id=restaurant_id,
        table_id=table_id,
        status = 'CREATED',
        created_at = datetime.utcnow()
    )

    db.session.add(new_order)
    db.session.flush()  # Get the order ID before committing

    total_amount = 0

    for item in items:
        menu_item = MenuItem.query.get(item['menu_item_id'])

        if not menu_item:
            return jsonify({"error": "Invalid menu item"}), 400
        
        quantity = item['quantity']
        subtotal = menu_item.price * quantity
        total_amount += subtotal

        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_item.id,
            quantity=quantity,
            item_price=menu_item.price,
            subtotal=subtotal
        )

        db.session.add(order_item)

    new_order.total_amount = total_amount

    upi_link = generate_upi_link(
        restaurant.upi_id, 
        restaurant.name, 
        total_amount
    )

    db.session.commit()

    return jsonify({
        "order_id": new_order.id,
        "total_amount": total_amount,
        "upi_link": upi_link,
        "status": new_order.status
    }), 201


@order_bp.route('/orders/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_orders(restaurant_id):
    orders = Order.query.filter_by(restaurant_id=restaurant_id).order_by(Order.created_at.desc()).all()

    result = []

    for order in orders:
        result.append({
            "order_id": order.id,
            "table_id": order.table_id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "items": [
                {
                    "id": item.id,
                    "menu_item_id": item.menu_item_id,
                    "name": item.menu_item.name if item.menu_item else "Unknown item",
                    "price": item.item_price,
                    "quantity": item.quantity,
                    "subtotal": item.subtotal
                }
                for item in order.items
            ]
        })

    return jsonify(result)


@order_bp.route('/order/update_status/<int:order_id>', methods=['PUT']) 
def update_order_status(order_id):
    data = request.json
    new_status = (data.get('status') or "").upper()

    valid_statuses = ['CREATED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED']

    if new_status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400
    
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    order.status = new_status
    db.session.commit()

    return jsonify({
        "message": "Status updated",
        "order_id": order.id,
        "new_status": order.status
    })
