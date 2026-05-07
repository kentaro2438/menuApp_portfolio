//css
import '../reset.css';
import '../css/Spinner.css';
import '../css/refrigerator_shoppinglist.css';
//react
import { useEffect, useState } from "react";
//api
import { getAllIng, getCat, getShoppingList, addIngToShoppingList, deleteIngFromShoppingList } from '../api/api.js';
//types
import type { ingType, catType } from '../types/type.ts';
//components
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import ShoppingCard from '../components/ShoppingCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
//context
import { useNotification } from '../context/NotificationContext.tsx';
import { ShoppingCart } from 'lucide-react';
//icons
import PlusIcon from '../img/Plus.svg';
import CheckIcon from '../img/Check.svg';


function ShoppingList() {

    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [showCatId, setShowCatId] = useState("");
    const [searchWord, setSearchWord] = useState(""); //検索文字
    const [isOpenShoppingList, setIsOpenShoppingList] = useState<boolean>(true); //買い物リストの開閉状態
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700); //画面サイズが700px以下かどうか
    const [shoppingList, setShoppingList] = useState<ingType[]>([]); //買い物リストにある材料   
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const shoppingListIngIdSet = new Set(shoppingList.map(ing => ing.ing_id)); //買い物リストにある材料IDのセット（重複なし）
    const { showNotification } = useNotification();

    //ローディング表示
    useEffect(() => {
        const firstFetch = async () => {
            setFirstLoading(true);
            await fetchGetAllIng();
            await fetchGetCat();
            await fetchGetShoppingList();
            setFirstLoading(false);
        };
        firstFetch();
    }, []);

        //画面サイズの変更を監視してisMobileを更新
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (firstLoading) {
        return <LoadingSpinner />;
    };

    //全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    //検索とカテゴリー絞り込み
    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory = showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch = ing.ing_name.includes(searchWord.trim());
        const notInShoppingList = !shoppingListIngIdSet.has(ing.ing_id); //買い物リストにない材料のみ表示
        return matchCategory && matchSearch && notInShoppingList;
    });

    // 買い物リストの材料を取得
    const fetchGetShoppingList = async () => {
        const data = await getShoppingList();
        setShoppingList(data.shopping_list_json);
    };

    //買い物リストに材料を追加
    const handleAddIngToShoppingList = async (ing_id: number) => {
        try {
            await addIngToShoppingList(ing_id);
            showNotification("success", "材料が買い物リストに追加されました");
            fetchGetShoppingList();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    //買い物リストから材料を削除して冷蔵庫に入れる
    const handleDeleteIngFromShoppingList = async (ing_id: number) => {
        try {
            await deleteIngFromShoppingList(ing_id);
            showNotification("success", "材料が買い物リストから削除されました");
            fetchGetShoppingList();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    return (
        <div className="main shopping-list-page">
            <h2><ShoppingCart className='h2-icon' />買い物リスト</h2>
            <p>買い物リストを管理できます．以下のリストで材料を追加・削除できます．</p>
            <div className="input-area">
                <Input
                    word={searchWord}
                    setWord={setSearchWord}
                    placeholder="材料名を検索"
                />
                <Select
                    showCatId={showCatId}
                    setShowCatId={setShowCatId}
                    catData={catData}
                />
            </div>
            <div className='tabs'>
                <button
                className={!isOpenShoppingList ? 'tab active' : 'tab'}
                onClick={() => setIsOpenShoppingList(false)}
                >
                    材料一覧
                </button>
                <button
                className={isOpenShoppingList ? 'tab active' : 'tab'}
                onClick={() => setIsOpenShoppingList(true)}
                >
                    買い物リスト
                </button>
            </div>
            <div className='two-columns-container'>
                <div className={
                    isMobile 
                    ? (isOpenShoppingList ? 'not-purchased hidden' : 'not-purchased')
                    : 'not-purchased'
                }>
                    <div className='card-header'>
                        材料一覧
                        <span className='length'>{filteredIngData.length}</span>
                        <span className='icon-hint'>
                            <img src={PlusIcon} alt="追加" />
                            買い物リストに追加
                        </span>
                    </div>
                    <div className="ref-columns-container">
                        {filteredIngData
                            .sort((a, b) => a.cat_id - b.cat_id)
                            .map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <ShoppingCard
                                        key={ing.ing_id}
                                        ing={ing}
                                        catId={catId}
                                        catName={catName}
                                        type="add"
                                        onClick={handleAddIngToShoppingList}
                                    />
                                )
                            })}
                    </div>
                </div>
                <div className={
                    isMobile 
                    ? (!isOpenShoppingList ? 'purchased hidden' : 'purchased')
                    : 'purchased'
                }>
                    <div className='card-header'>
                        買い物リスト
                        <span className='length'>{shoppingList.length}</span>
                        <span className='icon-hint'>
                            <img src={CheckIcon} alt="購入済み" />
                            購入済みにする
                        </span>
                    </div>
                    <div className="ref-columns-container">
                        {shoppingList
                            .map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <ShoppingCard
                                        key={ing.ing_id}
                                        ing={ing}
                                        catId={catId}
                                        catName={catName}
                                        type="delete"
                                        onClick={handleDeleteIngFromShoppingList}
                                    />
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;