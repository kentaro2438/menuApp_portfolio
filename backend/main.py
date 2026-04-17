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


# API------------------------------------------------------------------------------------------------------------------------------------
# 材料をすべて取得するAPI
@app.route("/api/getAllIng", methods=["GET"])
def get_all_ing():
    ing_list = Ingredient.query.all()
    # ing_list = [
    #    Ingredient(ing_id=1, ing_name="野菜", cat_id=1),
    #    Ingredient(ing_id=2, ing_name="肉", cat_id=2), ...
    #   ]
    ing_list_dict = [
        {
            "ing_id": ing.ing_id,
            "ing_name": ing.ing_name,
            "cat_id": ing.cat_id,
        }
        for ing in ing_list
    ]
    return {"ing_list": ing_list_dict}


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


# カテゴリーを取得するAPI
@app.route("/api/getCategory", methods=["GET"])
def get_category():
    cat_list = Category.query.all()
    # cat_list = [
    #    Category(cat_id=1, cat_name="野菜"),
    #    Category(cat_id=2, cat_name="肉"),
    #   ]
    cat_list_dict = [
        {
            "cat_id": cat.cat_id,
            "cat_name": cat.cat_name,
        }
        for cat in cat_list
    ]
    return jsonify({"cat_list": cat_list_dict}), 200


# 料理をすべて取得するAPI
@app.route("/api/getAllDish", methods=["GET"])
def get_all_dish():
    dish_list = Dish.query.all()
    # dish_list = [
    #    Dish(dish_id=1, dish_name="カレー"),
    #    Dish(dish_id=2, dish_name="シチュー"),
    #   ]
    dish_list_dict = [
        {
            "dish_id": dish.dish_id,
            "dish_name": dish.dish_name,
        }
        for dish in dish_list
    ]
    return jsonify({"dish_list": dish_list_dict}), 200


# 特定の料理を取得するAPI
@app.route("/api/getDish/<int:dish_id>", methods=["GET"])
def get_dish(dish_id):
    dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
    ing_dish_set_list = Ing_Dish_Set.query.filter_by(dish_id=dish_id).all()
    ing_id_needed_list = [ing_dish_set.ing_id for ing_dish_set in ing_dish_set_list]
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


# 材料を登録するAPI
@app.route("/api/newIng", methods=["POST"])
def new_ing():
    data = request.get_json()
    new_ing = Ingredient(ing_name=data["new_ing_name"], cat_id=data["cat_id"])
    existing = Ingredient.query.filter_by(ing_name=data["new_ing_name"]).first()
    if existing:
        return jsonify({"message": "この材料はすでに登録されています"}), 400
    db.session.add(new_ing)
    db.session.commit()
    return (
        jsonify({"message": "材料が正常に追加されました。", "ing_id": new_ing.ing_id}),
        201,
    )


# 材料を編集するAPI
@app.route("/api/editIng/<int:ing_id>", methods=["PUT"])
def edit_ing(ing_id):
    data = request.get_json()
    ing = Ingredient.query.filter_by(ing_id=ing_id).first_or_404()
    ing.ing_name = data["ing_name"]
    ing.cat_id = data["cat_id"]
    db.session.commit()
    return (
        jsonify({"message": "材料が正常に編集されました。"}),
        200,
    )


# 材料を削除するAPI
@app.route("/api/deleteIng/<int:ing_id>", methods=["DELETE"])
def delete_ing(ing_id):
    ing = Ingredient.query.filter_by(ing_id=ing_id).first_or_404()
    db.session.delete(ing)
    db.session.commit()
    return (
        jsonify({"message": "材料が正常に削除されました。"}),
        200,
    )


# 料理を登録するAPI
@app.route("/api/newDish", methods=["POST"])
def new_dish():
    data = request.get_json()

    new_dish_name = (data.get("new_dish_name") or "").strip()
    if not new_dish_name:
        return jsonify({"message": "料理名を入力してください。"}), 400

    ing_id_needed_list = data.get("ing_id_needed_list")
    if not ing_id_needed_list:
        return jsonify({"message": "材料を選択してください。"}), 400

    existing = Dish.query.filter_by(dish_name=new_dish_name).first()
    if existing:
        return jsonify({"message": "その料理はすでに登録されています。"}), 400

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

    return (
        jsonify(
            {
                "message": "料理が正常に追加されました。",
                "dish_id": new_dish.dish_id,
            }
        ),
        201,
    )


# 料理を編集するAPI
@app.route("/api/editDish/<int:dish_id>", methods=["PUT"])
def edit_dish(dish_id):
    data = request.get_json()

    dish_name = (data.get("dish_name") or "").strip()
    if not dish_name:
        return jsonify({"message": "料理名を入力してください。"}), 400

    ing_id_needed_list = data.get("ing_id_needed_list")
    if not ing_id_needed_list:
        return jsonify({"message": "材料を選択してください。"}), 400

    try:
        now_dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
        now_dish.dish_name = dish_name

        Ing_Dish_Set.query.filter_by(dish_id=dish_id).delete(synchronize_session=False)

        for ing_id_needed in ing_id_needed_list:
            ing_dish_set = Ing_Dish_Set(
                dish_id=now_dish.dish_id,
                ing_id=int(ing_id_needed),
            )
            db.session.add(ing_dish_set)

        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    return jsonify({"message": "料理が正常に編集されました。"}), 200


# 料理を削除するAPI
@app.route("/api/deleteDish/<int:dish_id>", methods=["DELETE"])
def delete_dish(dish_id):
    dish = Dish.query.filter_by(dish_id=dish_id).first_or_404()
    db.session.delete(dish)
    db.session.commit()
    return (
        jsonify({"message": "料理が正常に削除されました。"}),
        200,
    )


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
