import '../reset.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDishes } from '../api/api.js';
import type { dishType } from '../types/type.ts';
import Input from '../components/Input.tsx';

function ListDish() {

    const [dishesData, setDishesData] = useState<dishType[]>([]);
    const [search, setSearch] = useState('');

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
            <Input
                word={search}
                setWord={setSearch}
                placeholder="料理名を検索"
            />
            {filteredDishes.map((dish: dishType) => (
                <div key={dish.dish_id} className='card'>
                    <p>{dish.dish_name}</p>
                    <Link to={`/list_dish/edit/${dish.dish_id}`}>
                        編集
                    </Link>
                </div>
            ))}
            <Link to="/list_dish/add" className='add-btn'>料理を追加</Link>
        </div>
    )
};

export default ListDish;