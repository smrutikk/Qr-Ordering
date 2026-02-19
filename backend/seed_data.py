from datetime import datetime, timedelta

from app import create_app
from extensions import db
from models import MenuItem, Order, OrderItem, Owner, Restaurant, Table


def get_or_create_owner(email: str, password: str) -> Owner:
    owner = Owner.query.filter_by(email=email).first()
    if owner:
        return owner

    owner = Owner(email=email)
    owner.set_password(password)
    db.session.add(owner)
    db.session.flush()
    return owner


def get_or_create_restaurant(name: str, slug: str, upi_id: str) -> Restaurant:
    restaurant = Restaurant.query.filter_by(slug=slug).first()
    if restaurant:
        return restaurant

    restaurant = Restaurant(name=name, slug=slug, upi_id=upi_id)
    db.session.add(restaurant)
    db.session.flush()
    return restaurant


def ensure_tables(restaurant_id: int, table_numbers: list[int]) -> list[Table]:
    tables = []
    for number in table_numbers:
        table = Table.query.filter_by(
            restaurant_id=restaurant_id, table_number=number
        ).first()
        if not table:
            table = Table(restaurant_id=restaurant_id, table_number=number)
            db.session.add(table)
            db.session.flush()
        tables.append(table)
    return tables


def ensure_menu(restaurant_id: int, menu_data: list[dict]) -> list[MenuItem]:
    menu_items = []
    for item_data in menu_data:
        item = MenuItem.query.filter_by(
            restaurant_id=restaurant_id, name=item_data["name"]
        ).first()
        if not item:
            item = MenuItem(
                restaurant_id=restaurant_id,
                name=item_data["name"],
                price=item_data["price"],
            )
            db.session.add(item)
            db.session.flush()
        menu_items.append(item)
    return menu_items


def seed_orders(restaurant: Restaurant, tables: list[Table], menu_items: list[MenuItem]) -> int:
    existing = Order.query.filter_by(restaurant_id=restaurant.id).count()
    if existing > 0:
        return 0

    specs = [
        {"table": tables[0], "status": "CREATED", "items": [(menu_items[0], 2), (menu_items[2], 1)]},
        {"table": tables[1], "status": "PREPARING", "items": [(menu_items[1], 1), (menu_items[3], 2)]},
        {"table": tables[2], "status": "READY", "items": [(menu_items[4], 3)]},
        {"table": tables[3], "status": "SERVED", "items": [(menu_items[0], 1), (menu_items[5], 1)]},
    ]

    for index, spec in enumerate(specs):
        order = Order(
            restaurant_id=restaurant.id,
            table_id=spec["table"].id,
            status=spec["status"],
            created_at=datetime.utcnow() - timedelta(minutes=(index + 1) * 7),
            total_amount=0.0,
        )
        db.session.add(order)
        db.session.flush()

        total = 0.0
        for menu_item, quantity in spec["items"]:
            subtotal = menu_item.price * quantity
            total += subtotal
            db.session.add(
                OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity,
                    item_price=menu_item.price,
                    subtotal=subtotal,
                )
            )
        order.total_amount = total

    return len(specs)


def main() -> None:
    app = create_app()
    with app.app_context():
        db.create_all()

        owner = get_or_create_owner("admin@demo.com", "admin123")
        restaurant = get_or_create_restaurant(
            name="Demo Bistro",
            slug="demo-bistro",
            upi_id="demo@upi",
        )
        tables = ensure_tables(restaurant.id, [1, 2, 3, 4, 5])
        menu_items = ensure_menu(
            restaurant.id,
            [
                {"name": "Margherita Pizza", "price": 249},
                {"name": "Paneer Tikka", "price": 299},
                {"name": "Veg Burger", "price": 149},
                {"name": "Cold Coffee", "price": 129},
                {"name": "Masala Dosa", "price": 179},
                {"name": "Fries", "price": 99},
            ],
        )
        created_orders = seed_orders(restaurant, tables, menu_items)

        db.session.commit()

        print("Seed complete.")
        print(f"Owner login: admin@demo.com / admin123")
        print(f"Restaurant id: {restaurant.id}")
        print(f"Orders created in this run: {created_orders}")


if __name__ == "__main__":
    main()
