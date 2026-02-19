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

# Get all tables for a restaurant
@restaurant_bp.route('/tables/<int:restaurant_id>', methods=['GET'])
def get_tables(restaurant_id):
    tables = Table.query.filter_by(restaurant_id=restaurant_id).all()

    result = []
    for table in tables:
        result.append({
            "id": table.id,
            "table_number": table.table_number,
            "restaurant_id": table.restaurant_id
        })

    return jsonify(result), 200

# Delete table
@restaurant_bp.route('/table/<int:table_id>', methods=['DELETE'])
def delete_table(table_id):
    table = Table.query.get(table_id)

    if not table:
        return jsonify({"error": "Table not found"}), 404

    db.session.delete(table)
    db.session.commit()

    return jsonify({"message": "Table deleted successfully"}), 200
