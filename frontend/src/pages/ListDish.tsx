import '../reset.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDish, deleteDish } from '../api/api.js';
import type { dishType } from '../types/type.ts';
import Input from '../components/Input.tsx';
import { Pencil, Trash } from 'lucide-react';

function ListDish() {

    const [dishesData, setDishesData] = useState<dishType[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGetAllDish();
    }, []);

    const fetchGetAllDish = async () => {
        const data = await getAllDish();
        setDishesData(data.dish_list_json);
    };

    const fetchDeleteDish = async (dish_id: number) => {
        await deleteDish(dish_id);
        await fetchGetAllDish();
    }

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
                        <p className='name dish-name'>{dish.dish_name}</p>
                        <div className="btn-container">
                            <Link
                                to={`/list_dish/edit/${dish.dish_id}`}
                                className='btn btn-sub edit'
                            >
                                <span className='lucide-icon'>
                                    <Pencil />
                                </span>
                            </Link>
                            <button
                                onClick={async () => {
                                    if (window.confirm('本当に削除しますか？')) {
                                        await fetchDeleteDish(dish.dish_id);
                                    }
                                }}
                                className='btn btn-sub delete'
                            >
                                <span className='lucide-icon'>
                                    <Trash />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default ListDish;