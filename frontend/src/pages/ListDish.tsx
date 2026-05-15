//css
import '../reset.css';
//react
import { useEffect, useState } from "react";
//api
import { getAllDish, deleteDish } from '../api/api.js';
//types
import type { dishType } from '../types/type.ts';
//components
import Input from '../components/Input.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
//context
import { useNotification } from '../context/NotificationContext.tsx';
import { Link } from "react-router-dom";
//icons
import { CookingPot, Plus } from 'lucide-react';
import DeleteIcon from '../img/Delete.svg';
import EditIcon from '../img/Edit.svg';


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
        return <LoadingSpinner />;
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
            <h2><CookingPot className='h2-icon' />料理</h2>
            <hr />
            <div className="contents-area">
                <p>登録済みの料理を確認できます</p>
                <div className="input-area">
                    <div className="input-area-for-mb">
                        <Input
                            word={search}
                            setWord={setSearch}
                            placeholder="料理名を検索"
                        />
                    </div>
                    <Link to="/list_dish/add" className='btn to-add-dish-btn'><Plus className='icon-in-btn' />料理を追加</Link>
                </div>
                <section className='ing-list'>
                    <div className='card-header'>
                        料理一覧
                        <span className='length'>{filteredDishes.length}</span>
                        <span className='icon-hint'>
                            <img src={EditIcon} alt="編集"/>
                            料理を編集
                            <img src={DeleteIcon} alt="削除"/>
                            料理を削除
                        </span>
                    </div>
                    <div className="card-columns-container">
                        {filteredDishes.map((dish: dishType) => (
                            <div key={dish.dish_id} className='card'>
                                <div className="card-row">
                                    <p className='name'>
                                        {dish.dish_name}
                                    </p>
                                    <div className="card-right">
                                        <Link
                                            to={`/list_dish/edit/${dish.dish_id}`}
                                            className='icon-btn'
                                        >
                                            <img src={EditIcon} alt="編集" className='icon edit' />
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('本当に削除しますか？')) {
                                                    await fetchDeleteDish(dish.dish_id);
                                                }
                                            }}
                                            className='icon-btn'
                                        >
                                            <img src={DeleteIcon} alt="削除" className='icon delete' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
};

export default ListDish;