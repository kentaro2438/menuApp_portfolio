import '../reset.css';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDishes } from '../api/api.js';
import type { dishType } from '../types/type.ts';

function ListDish() {

    const [dishesData, setDishesData] = useState<dishType[]>([]);
    const [search, setSearch] = useState(''); // ←追加

    useEffect(() => {
        fetchGetAllDishes();
    }, []);

    const fetchGetAllDishes = async () => {
        const data = await getAllDishes();
        setDishesData(data.dish_list);
    };

    // 検索フィルタ
    const filteredDishes = dishesData.filter((dish) =>
        dish.dish_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="main">
            <h2>料理一覧</h2>

            {/* 検索フォーム */}
            <input
                type="text"
                placeholder="料理名で検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/list_dish/add">料理を追加</Link>
            {/* 検索結果の表示 */}
            {filteredDishes.map((dish: dishType) => (
                <div key={dish.dish_id}>
                    <Link to={`/list_dish/edit/${dish.dish_id}`}>
                        {dish.dish_name}
                    </Link>
                </div>
            ))}
        </div>
    )
};

export default ListDish;