from flask import Flask, redirect, request, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# データベース設定------------------------------------------------------------------------------------------------------------------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://urara2438@localhost/postgres"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy()
migrate = Migrate()

db.init_app(app)
migrate.init_app(app, db)


class Ingredient(db.Model):
    __tablename__ = "ingredient"
    ing_id = db.Column(db.Integer, primary_key=True)
    ing_name = db.Column(db.String(20), unique=True, nullable=False)
    cat_id = db.Column(db.Integer, db.ForeignKey("category.cat_id"), nullable=False)


class Category(db.Model):
    __tablename__ = "category"
    cat_id = db.Column(db.Integer, primary_key=True)
    cat_name = db.Column(db.String(20), unique=True, nullable=False)


class Dish(db.Model):
    __tablename__ = "dish"
    dish_id = db.Column(db.Integer, primary_key=True)
    dish_name = db.Column(db.String(20), unique=True, nullable=False)


class Ing_Dish_Set(db.Model):
    __tablename__ = "ing_dish_set"
    dish_id = db.Column(db.Integer, db.ForeignKey("dish.dish_id"), primary_key=True)
    ing_id = db.Column(db.Integer, db.ForeignKey("ingredient.ing_id"), primary_key=True)


# 冷蔵庫
class Refrigerator(db.Model):
    __tablename__ = "refrigerator"
    ing_id = db.Column(db.Integer, db.ForeignKey("ingredient.ing_id"), primary_key=True)
    ingredient = db.relationship("Ingredient")


# API------------------------------------------------------------------------------------------------------------------------------------
# 全ての材料を取得するAPI
@app.route("/api/getAllIng", methods=["GET"])
def get_all_ing():
    ing_list = Ingredient.query.all()
    ing_list_json = []
    for ing in ing_list:
        ing_list_json.append(
            {
                "ing_id": ing.ing_id,
                "ing_name": ing.ing_name,
                "cat_id": ing.cat_id,
            }
        )
    return jsonify({"ing_list_json": ing_list_json}), 200


# 特定の材料を取得するAPI
@app.route("/api/getIng/<int:ing_id>", methods=["GET"])
def get_ing(ing_id):
    ing = Ingredient.query.filter_by(ing_id=ing_id).first_or_404()
    return (
        jsonify(
            {
                "ing_id": ing.ing_id,
                "ing_name": ing.ing_name,
                "cat_id": ing.cat_id,
            }
        ),
        200,
    )


# 材料を登録するAPI
@app.route("/api/addIng", methods=["POST"])
def add_ing():
    data = request.get_json()
    new_ing = Ingredient(ing_name=data["new_ing_name"], cat_id=data["new_ing_cat_id"])
    existing = Ingredient.query.filter_by(ing_name=data["new_ing_name"]).first()
    if existing:
        return jsonify({"message": "この材料はすでに登録されています"}), 400
    db.session.add(new_ing)
    db.session.commit()
    return jsonify({"message": "材料が登録されました"}), 201


# 材料を編集するAPI
@app.route("/api/editIng/<int:ing_id>", methods=["PUT"])
def edit_ing(ing_id):
    data = request.get_json()
    ing = Ingredient.query.filter_by(ing_id=ing_id).first_or_404()
    ing.ing_name = data["ing_name"]
    ing.cat_id = data["cat_id"]
    db.session.commit()
    return jsonify({"message": "材料が編集されました"}), 200


# カテゴリーを全て取得するAPI
@app.route("/api/getCat", methods=["GET"])
def get_cat():
    cat_list = Category.query.all()
    cat_list_json = []
    for cat in cat_list:
        cat_list_json.append(
            {
                "cat_id": cat.cat_id,
                "cat_name": cat.cat_name,
            }
        )
    return jsonify({"cat_list_json": cat_list_json}), 200


# 全ての料理を取得するAPI
@app.route("/api/getAllDish", methods=["GET"])
def get_all_dish():
    dish_list = Dish.query.all()
    dish_list_json = []
    for dish in dish_list:
        dish_list_json.append(
            {
                "dish_id": dish.dish_id,
                "dish_name": dish.dish_name,
            }
        )
    return jsonify({"dish_list_json": dish_list_json}), 200


# 特定の料理を取得するAPI
@app.route("/api/getDish/<int:dish_id>", methods=["GET"])
def get_dish(dish_id):
    dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
    ing_dish_set_list = Ing_Dish_Set.query.filter_by(dish_id=dish_id).all()
    ing_id_needed_list = []
    for ing_dish_list in ing_dish_set_list:
        ing_id_needed_list.append(ing_dish_list.ing_id)
    return (
        jsonify(
            {
                "dish_id": dish.dish_id,
                "dish_name": dish.dish_name,
                "ing_id_needed_list": ing_id_needed_list,
            }
        ),
        200,
    )


# 料理を登録するAPI
@app.route("/api/addDish", methods=["POST"])
def new_dish():
    data = request.get_json()

    new_dish_name = data["new_dish_name"].strip()
    if not new_dish_name:
        return jsonify({"message": "料理名を入力してください"}), 400

    ing_id_needed_list = data["ing_id_needed_list"]
    if not ing_id_needed_list:
        return jsonify({"message": "材料を選択してください"}), 400

    existing = Dish.query.filter_by(dish_name=new_dish_name).first()
    if existing:
        return jsonify({"message": "その料理はすでに登録されています"}), 400

    try:
        new_dish = Dish(dish_name=new_dish_name)
        db.session.add(new_dish)
        db.session.flush()

        for ing_id_needed in ing_id_needed_list:
            new_ing_dish_set = Ing_Dish_Set(
                dish_id=new_dish.dish_id,
                ing_id=int(ing_id_needed),
            )
            db.session.add(new_ing_dish_set)

        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    return jsonify({"message": "料理が追加されました"}), 201


# 料理を編集するAPI
@app.route("/api/editDish/<int:dish_id>", methods=["PUT"])
def edit_dish(dish_id):
    data = request.get_json()

    dish_name = data["dish_name"].strip()
    if not dish_name:
        return jsonify({"message": "料理名を入力してください"}), 400

    ing_id_needed_list = data["ing_id_needed_list"]
    if not ing_id_needed_list:
        return jsonify({"message": "材料を選択してください"}), 400

    try:
        dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
        dish.dish_name = dish_name

        Ing_Dish_Set.query.filter_by(dish_id=dish_id).delete(synchronize_session=False)

        for ing_id_needed in ing_id_needed_list:
            ing_dish_set = Ing_Dish_Set(
                dish_id=dish.dish_id,
                ing_id=int(ing_id_needed),
            )
            db.session.add(ing_dish_set)

        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    return jsonify({"message": "料理が編集されました"}), 200


# 料理を削除するAPI
@app.route("/api/deleteDish/<int:dish_id>", methods=["DELETE"])
def delete_dish(dish_id):
    dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
    ing_dish_set_list = Ing_Dish_Set.query.filter_by(dish_id=dish_id).all()
    try:
        for ing_dish_set in ing_dish_set_list:
            db.session.delete(ing_dish_set)
        db.session.flush()
        db.session.delete(dish)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    return jsonify({"message": "料理が削除されました"}), 200


# 料理を検索するAPI
@app.route("/api/searchDish", methods=["POST"])
def search():
    data = request.get_json()

    searched_ing_id_list = data.get("searched_ing_id_list", [])
    searched_ing_id_list_int = list(map(int, searched_ing_id_list))

    result_list = []

    for dish in Dish.query.all():
        match_score = 0
        ing_dish_set_list = Ing_Dish_Set.query.filter_by(dish_id=dish.dish_id).all()

        for ing_dish_set in ing_dish_set_list:
            for searched_ing_id in searched_ing_id_list_int:
                if searched_ing_id == ing_dish_set.ing_id:
                    match_score += 1
                    break

        if match_score > 0:
            ing_needed = len(ing_dish_set_list)
            lack = ing_needed - match_score

            ing_id_needed_list_for_search = []
            for ing_dish_set in ing_dish_set_list:
                ing_id_needed_list_for_search.append(ing_dish_set.ing_id)

            lack_ing_id_list = []
            for ing_id_needed in ing_id_needed_list_for_search:
                if ing_id_needed not in searched_ing_id_list_int:
                    lack_ing_id_list.append(ing_id_needed)

            lack_ing_name_list = []
            for lack_ing_id in lack_ing_id_list:
                lack_ing_name = Ingredient.query.filter_by(ing_id=lack_ing_id).first()
                if lack_ing_name:
                    lack_ing_name_list.append(lack_ing_name.ing_name)

            result_list.append([dish.dish_name, match_score, lack, lack_ing_name_list])

    result_list.sort(key=lambda result: result[1], reverse=True)

    return jsonify({"result_list": result_list}), 200


# 冷蔵庫の中身を取得するAPI
@app.route("/api/ref", methods=["GET"])
def get_refrigerator():
    ings_in_ref = Refrigerator.query.all()
    ings_in_ref_list = []
    for ref in ings_in_ref:
        ings_in_ref_list.append(
            {
                "ing_id": ref.ing_id,
                "ing_name": ref.ingredient.ing_name,
                "cat_id": ref.ingredient.cat_id,
            }
        )
    return jsonify({"ings_in_ref_list_json": ings_in_ref_list})


# 冷蔵庫に材料を追加するAPI
@app.route("/api/ref", methods=["POST"])
def add_ing_to_ref():
    data = request.get_json()
    ing_id = data["ing_id"]
    existing = Refrigerator.query.filter_by(ing_id=ing_id).first()
    if existing:
        return jsonify({"message": "その材料はすでに冷蔵庫に入っています"}), 400
    new_ing_to_ref = Refrigerator(ing_id=ing_id)
    db.session.add(new_ing_to_ref)
    db.session.commit()
    return jsonify({"message": "冷蔵庫に材料が追加されました"}), 201


# 冷蔵庫から材料を削除するAPI
@app.route("/api/ref/<int:ing_id>", methods=["DELETE"])
def delete_ing_from_ref(ing_id):
    ing = Refrigerator.query.filter_by(ing_id=ing_id).first_or_404()
    db.session.delete(ing)
    db.session.commit()
    return jsonify({"message": "冷蔵庫から材料が削除されました"}), 200


# # 冷蔵庫にある材料から料理を検索するAPI
# @app.route("/api/searchDishFromRef", method=["GET"])
# def search_dish_from_ref():
