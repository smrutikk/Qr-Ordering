from flask import Blueprint, request, jsonify
from extensions import db
from models import Restaurant, Table

restaurant_bp = Blueprint('restaurant_bp', __name__)

@restaurant_bp.route('/restaurant/create', methods=['POST'])
def create_restaurant():
    data = request.json

    name = data.get('name')
    slug = data.get('slug')
    upi_id = data.get('upi_id')

    if not name or not slug or not upi_id:
        return jsonify({"error": "All fields are required"}), 400
    
    existing = Restaurant.query.filter_by(slug=slug).first()
    if existing:
        return jsonify({"error": "Slug already exists"}), 400
    
    new_restaurant = Restaurant(
        name=name, 
        slug=slug, 
        upi_id=upi_id
    )

    db.session.add(new_restaurant)
    db.session.commit() 

    return jsonify({
        "message": "Restaurant created successfully",
        "restaurant_id" : new_restaurant.id
    }),201

@restaurant_bp.route('/table/create', methods=['POST'])
def create_table():
    data = request.json

    table_number = data.get('table_number')
    restaurant_id = data.get('restaurant_id')

    table = Table(
        table_number=table_number,
        restaurant_id=restaurant_id
    )

    db.session.add(table)
    db.session.commit()

    return jsonify({"message": "Table created"})
