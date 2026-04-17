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
            <h2>料理</h2>
            <p>登録済みの料理を編集・削除できます</p>
            <div className="input-area">
                <Input
                    word={search}
                    setWord={setSearch}
                    placeholder="料理名を検索"
                />
                <Link to="/list_dish/add" className='btn btn-main'>料理を追加</Link>
            </div>
            {filteredDishes.map((dish: dishType) => (
                <div key={dish.dish_id} className='card dish-card'>
                    <div className="inner-wrap">
                        <p className='dish-name'>{dish.dish_name}</p>
                        <div className="btn-container">
                            <Link
                                to={`/list_dish/edit/${dish.dish_id}`}
                                className='btn btn-sub edit'
                            >
                                編集
                            </Link>
                            <Link
                                to={`/list_dish/delete/${dish.dish_id}`}
                                className='btn btn-sub delete'
                            >
                                削除
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
};

export default ListDish;