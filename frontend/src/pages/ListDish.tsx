import '../reset.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDish, deleteDish } from '../api/api.js';
import type { dishType } from '../types/type.ts';
import Input from '../components/Input.tsx';
import { Pencil, Trash2, CookingPot, Plus } from 'lucide-react';
import { useNotification } from '../context/NotificationContext.tsx';

function ListDish() {

    const [dishesData, setDishesData] = useState<dishType[]>([]);
    const [search, setSearch] = useState('');
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const { showNotification } = useNotification();

    //ローディング表示
    useEffect(() => {
        setFirstLoading(true);
        const firstFetch = async () => {
            await fetchGetAllDish();
            setFirstLoading(false);
        };
        firstFetch();
    }, []);

    if (firstLoading) {
        return (
            <div className="main loading-area">
                <div className="spinner"></div>
                <p>読み込み中...</p>
            </div>
        );
    }

    const fetchGetAllDish = async () => {
        const data = await getAllDish();
        setDishesData(data.dish_list_json);
    };

    const fetchDeleteDish = async (dish_id: number) => {
        await deleteDish(dish_id);
        showNotification("success", "料理が削除されました");
        await fetchGetAllDish();
    }

    // 検索フィルタ
    const filteredDishes = dishesData.filter((dish) =>
        dish.dish_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="main list-dish-page">
            <h2><CookingPot className='h2-icon' /> 料理</h2>
            <hr />
            <br />
            <p>登録済みの料理を編集・削除できます</p>
            <br />
            <div className='description'>
                <div>
                    <div className='icon-area edit'>
                        <Pencil className='icon-size' />
                    </div>
                    料理を編集
                </div>
                <div>
                    <div className='icon-area delete'>
                        <Trash2 className='icon-size' />
                    </div>
                    料理を削除
                </div>
            </div>
            <br />
            <div className="input-area">
                <Input
                    word={search}
                    setWord={setSearch}
                    placeholder="料理名を検索"
                />
                <Link to="/list_dish/add" className='btn btn-main'><Plus className='icon-in-main-btn' /> 料理を追加</Link>
            </div>
            <div>
                <p className='card-header'>料理一覧<span className='length'>{filteredDishes.length}</span></p>
                <div className="card-columns-container">
                    {filteredDishes.map((dish: dishType) => (
                        <div key={dish.dish_id} className='card dish-card'>
                            <div className="inner-wrap">
                                <p className='name'>{dish.dish_name}</p>
                                <div className="btn-container">
                                    <Link
                                        to={`/list_dish/edit/${dish.dish_id}`}
                                        className='btn btn-sub edit'
                                    >
                                        <Pencil className='lucide-icon' />
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('本当に削除しますか？')) {
                                                await fetchDeleteDish(dish.dish_id);
                                            }
                                        }}
                                        className='btn-sub delete'
                                    >
                                        <Trash2 className='lucide-icon' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ListDish;