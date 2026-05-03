import '../reset.css';
import '../css/home.css';
import { Apple, House, Search, TriangleAlert, CookingPot, Refrigerator, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext.tsx';
import { searchDish, getRefIng, getDish, getAllDish, getShoppingList } from '../api/api.js';
import type { refIngType } from '../types/type.ts';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { logout } from '../api/api.js';

function Home() {

    const [refIngData, setRefIngData] = useState<refIngType[]>([]); //冷蔵庫の材料
    const [randomDishName, setRandomDishName] = useState(""); //ランダムで表示する料理名
    const [shoppingList, setShoppingList] = useState<refIngType[]>([]); //買い物リストにある材料
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    //ローディング表示
    useEffect(() => {
        setFirstLoading(true);
        const firstFetch = async () => {
            await fetchGetRandomDish();
            await fetchGetRefIng();
            await fetchGetShoppingList();
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
    };

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

    //すべての料理を取得
    const fetchGetAllDish = async () => {
        const data = await getAllDish();
        return data.dish_list_json;
    };

    // 買い物リストの材料を取得
    const fetchGetShoppingList = async () => {
        const data = await getShoppingList();
        setShoppingList(data.shopping_list_json);
    };

    //ランダムで料理を1つ表示
    const fetchGetRandomDish = async () => {
        try {
            const allDishes = await fetchGetAllDish();

            if (!allDishes || allDishes.length === 0) {
                showNotification("error", "登録されている料理がありません");
                return;
            }

            const randomDish = allDishes[Math.floor(Math.random() * allDishes.length)];
            const data = await getDish(randomDish.dish_id);
            setRandomDishName(data.dish_name);
        } catch (error: any) {
            showNotification("error", error.message);
        }
    };

    //冷蔵庫の材料を取得
    const fetchGetRefIng = async () => {
        const data = await getRefIng();
        setRefIngData(data.ings_in_ref_list_json);
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

    //冷蔵庫にある材料で作れる料理を検索
    const handleSearch = async () => {
        setLoading(true);
        const refIngIds = refIngData.map(ing => ing.ing_id);
        if (refIngIds.length === 0) {
            showNotification("error", "冷蔵庫に材料がありません");
            setLoading(false);
            return;
        }
        try {
            const data = await searchDish(refIngIds);
            navigate("/result", {
                state: {
                    selectedIngIds: refIngIds,
                    resultList: data.result_list,
                },
            });
        } catch (error: any) {
            showNotification("error", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main home-page">
            <h2><House className='h2-icon' /> ホーム</h2>
            <hr />
            <div>
                ログイン機能テスト用エリア
                <button onClick={fetchLogout}>ログアウト</button>
            </div>
            <section>
                <h3>今日のおすすめ</h3>
                <p>{randomDishName}</p>
            </section>
            <section className='quick-action-section'>
                <h3>クイックアクション</h3>
                <div className='inner-container'>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <Search className='icon-size' />
                            </div>
                            <div>
                                <h4>料理を検索</h4>
                                <p>冷蔵庫の材料から料理を検索します</p>
                            </div>
                        </div>
                        <button className='btn btn-main' onClick={() => handleSearch()} disabled={loading}>
                            {loading ? "検索中..." : "検索する"}
                        </button>
                    </div>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <Apple className='icon-size' />
                            </div>
                            <div>
                                <h4>材料を追加</h4>
                                <p>新しい材料を追加します</p>
                                <br />
                            </div>
                        </div>
                        <Link to="/list_ing/add" className='btn btn-main'>追加する</Link>
                    </div>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <CookingPot className='icon-size' />
                            </div>
                            <div>
                                <h4>料理を追加</h4>
                                <p>新しい料理を追加します</p>
                                <br />
                            </div>
                        </div>
                        <Link to="/list_dish/add" className='btn btn-main'>追加する</Link>
                    </div>
                </div>
            </section>
            <section className='ref-summary-section'>
                <h3>サマリー</h3>
                <div className='inner-container'>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <Refrigerator className='icon-size' />
                            </div>
                            <div>
                                <h4>冷蔵庫の材料数</h4>
                                <p>{refIngData.length}<span>個</span></p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <TriangleAlert className='icon-size' />
                            </div>
                            <div>
                                <h4>1週間以上未使用の材料数</h4>
                                <p>{getDengerIngCount()}<span>個</span></p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex-container'>
                            <div className='icon-area'>
                                <ShoppingCart className='icon-size' />
                            </div>
                            <div>
                                <h4>買い物リストの材料数</h4>
                                <p>{shoppingList.length}<span>個</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default Home;