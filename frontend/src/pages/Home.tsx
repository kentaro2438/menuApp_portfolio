//css
import '../reset.css';
import '../css/Spinner.css';
import '../css/Home.css';
//react
import { useEffect, useState } from 'react';
//api
import { getRefIng, getShoppingList, logout, searchDish } from '../api/api.js';
//types
import type { refIngType } from '../types/type.ts';
//components
import LoadingSpinner from '../components/LoadingSpinner.tsx';
//context
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
//icons
import { Apple, House, TriangleAlert, CookingPot, Refrigerator, ShoppingCart, ArrowRight } from 'lucide-react';



function Home() {

    const [refIngData, setRefIngData] = useState<refIngType[]>([]); //冷蔵庫の材料
    const [possibleDishList, setPossibleDishList] = useState<string[]>([]); //冷蔵庫の材料で作れる料理のリスト  
    const [shoppingList, setShoppingList] = useState<refIngType[]>([]); //買い物リストにある材料
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    //ローディング表示
useEffect(() => {
    const firstFetch = async () => {
        try {
            setFirstLoading(true);
            fetchGetShoppingList();
            const refData = await getRefIng();
            const refIngs = refData.ings_in_ref_list_json;
            setRefIngData(refIngs);
            await fetchPossibleDishes(refIngs);
        } catch (error: any) {
            showNotification("error", error.message);
        } finally {
            setFirstLoading(false);
        }
    };
    firstFetch();
}, []);

    if (firstLoading) {
        return <LoadingSpinner />;
    }

    //ログアウト
    const fetchLogout = async () => {
        try {
            await logout();
            showNotification("success", "ログアウトしました");
            navigate("/");
        } catch (error: any) {
            showNotification("error", error.message);
        }
    };

    // 買い物リストの材料を取得
    const fetchGetShoppingList = async () => {
        const data = await getShoppingList();
        setShoppingList(data.shopping_list_json);
    };

    //冷蔵庫に追加してから1週間以上経過した材料数を表示
    const getDengerIngCount = () => {
        const dengerIngList = refIngData.filter(ing => {
            const addedAt = new Date(ing.added_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - addedAt.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 7;
        });
        return dengerIngList.length;
    }

    //冷蔵庫の材料で作れる料理を取得
    const fetchPossibleDishes = async (refIngs: refIngType[]) => {
        const refIngIds = refIngs.map(ing => ing.ing_id);
        console.log(refIngIds);
        if (refIngIds.length === 0) {
            setPossibleDishList([]);
            return;
        }
        try {
            const data = await searchDish(refIngIds);
            setPossibleDishList(data.result_list);
        } catch (error: any) {
            showNotification("error", error.message);
        }
    };


    return (
        <div className="main home-page">
            <h2><House className='h2-icon' />ホーム</h2>
            <p>今日のおすすめやクイックアクションを確認できます</p>
            <div>
                ログイン機能テスト用エリア
                <button onClick={fetchLogout} className='btn'>ログアウト</button>
            </div>
            <div className='section-container'>
                <section className='recommend-section'>
                    <h3>冷蔵庫の材料で作れる料理</h3>
                    <div className='recommend-dish-container'>
                        {possibleDishList.length === 0 ? (
                            <p>作れる料理が見つかりませんでした</p>
                        ) : (
                            <ul>
                                {possibleDishList.slice(0, 5).map((dish, index) => (
                                    <li key={index}>{dish[0]}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
                <div className='quick-action-and-summary'>
                    <section className='quick-action-section'>
                        <h3>クイックアクション</h3>
                        <div className='quick-action-container'>
                            <div className='see-ref'>
                                <div className='flex'>
                                    <Refrigerator className='quick-action-icon' />
                                    <div>
                                        <h4>冷蔵庫を見る</h4>
                                        <p>保存中の材料を確認</p>
                                    </div>
                                </div>
                                <Link to="/refrigerator" className='quick-action-link'><ArrowRight /></Link>
                            </div>
                            <div className='add-ing'>
                                <div className='flex'>
                                    <Apple className='quick-action-icon' />
                                    <div>
                                        <h4>材料を追加</h4>
                                        <p>新しい材料を追加</p>
                                    </div>
                                </div>
                                <Link to="/list_ing/add" className='quick-action-link'><ArrowRight /></Link>
                            </div>
                            <div className='add-dish'>
                                <div className='flex'>
                                    <CookingPot className='quick-action-icon' />
                                    <div>
                                        <h4>料理を追加</h4>
                                        <p>新しい料理を追加</p>
                                    </div>
                                </div>
                                <Link to="/list_dish/add" className='quick-action-link'><ArrowRight /></Link>
                            </div>
                        </div>
                    </section>
                    <section className='summary-section'>
                        <h3>サマリー</h3>
                        <div className="summary-container">
                            <div className='ing-in-ref'>
                                <div className="flex">
                                    <Refrigerator className='summary-icon' />
                                    <div>
                                        <h4>{refIngData.length}</h4>
                                        <p>冷蔵庫の材料数</p>
                                    </div>
                                </div>
                            </div>
                            <div className='denger-ing'>
                                <div className="flex">
                                    <TriangleAlert className='summary-icon' />
                                    <div>
                                        <h4>{getDengerIngCount()}</h4>
                                        <p>賞味期限が近い材料</p>
                                    </div>
                                </div>
                            </div>
                            <div className='ing-in-shopping-list'>
                                <div className="flex">
                                    <ShoppingCart className='summary-icon' />
                                    <div>
                                        <h4>{shoppingList.length}</h4>
                                        <p>買い物リストの材料数</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
};

export default Home;