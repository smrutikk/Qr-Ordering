from flask import Blueprint, request, jsonify
from models.owner import Owner
from extensions import db
from flask_jwt_extended import create_access_token


auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    if Owner.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    owner = Owner(email=data["email"])
    owner.set_password(data["password"])

    db.session.add(owner)
    db.session.commit()

    return jsonify({"message": "Owner registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    owner = Owner.query.filter_by(email=data["email"]).first()

    if not owner or not owner.check_password(data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=owner.id)

    return jsonify({
        "message": "Login successful",
        "token": access_token
    }), 200

